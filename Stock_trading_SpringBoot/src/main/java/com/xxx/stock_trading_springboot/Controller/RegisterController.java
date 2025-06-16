package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Mapper.UserMapper;
import com.xxx.stock_trading_springboot.Service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
@RequestMapping("/register")
@RestController
public class RegisterController {
    @Autowired
    private RegisterService registerService;
    @Autowired
    private StringRedisTemplate redisTemplate;
    @RequestMapping("/verify-code")
    public ResponseEntity<?> register(@RequestBody Map<String,Object> requestBody) {
        User user = new User();
        user.setNickName((String) requestBody.get("nickName"));
        user.setName((String) requestBody.get("name"));
        user.setPhone((String) requestBody.get("phone"));
        user.setPassword((String) requestBody.get("password"));
        user.setSex((String) requestBody.get("sex"));
        user.setStatus((String) requestBody.get("status"));
        user.setRole((String)requestBody.get("role"));
        user.setCreateTime((String) requestBody.get("createTime"));
        user.setUpdateTime((String) requestBody.get("updateTime"));
        user.setAvatar("avatar_" + user.getNickName() + ".png");
        user.setEmail((String) requestBody.get("email"));
        String email = requestBody.get("email").toString();
        String code = requestBody.get("verificationCode").toString();
        String key = "email:code:" + email;
        String savedCode = redisTemplate.opsForValue().get(key);
        if (savedCode != null && savedCode.equals(code)) {
            redisTemplate.delete(key);
            Map<String, Object> response = registerService.register(user);
            if (response.get("code").equals(200)) {
                return ResponseEntity.ok(response);
            }else {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", response.get("msg")));
            }
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("验证码错误或已过期");
        }
    }
    @Autowired
    private UserMapper userMapper;
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private JavaMailSender mailSender;
    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> map) {
        String email = map.get("email");
        User user = userMapper.selectUserByEmail(email);
        if (user == null) {
            // 生成6位随机验证码
            String code = String.valueOf((int)((Math.random() * 9 + 1) * 100000));

            // 存入Redis，5分钟过期
            redisTemplate.opsForValue().set("email:code:" + email, code, 5, TimeUnit.MINUTES);

            // 发送邮件
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("1494248473@qq.com");
            message.setTo(email);
            message.setSubject("登录验证码");
            message.setText("你的验证码是：" + code + "，5分钟内有效。");
            mailSender.send(message);
            return ResponseEntity.ok(Map.of(
                    "code", 200,
                    "success", true,
                    "message", "如果该邮箱已注册，我们已发送验证码"
            ));
        }else {
            //return ResponseEntity.ok("如果该邮箱已注册，我们已发送验证码");

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "该邮箱已注册"));
        }
    }
}
