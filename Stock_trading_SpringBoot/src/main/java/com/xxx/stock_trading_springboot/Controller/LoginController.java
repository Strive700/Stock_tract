package com.xxx.stock_trading_springboot.Controller;
import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Mapper.UserMapper;
import com.xxx.stock_trading_springboot.Service.LoginService;
import com.xxx.stock_trading_springboot.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
import java.util.concurrent.TimeUnit;
@RequestMapping("/login")
@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;
    @RequestMapping("/username")
    public Map<String , Object> login(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
        Map<String , Object> response;
        String username = (String) requestBody.get("username");
        String password = (String) requestBody.get("password");
        response = loginService.login(username, password);
        if("Login success".equals(response.get("msg"))) {
            // 设置session对象
            HttpSession session = request.getSession();
            session.setAttribute("user", response.get("user"));
        }
        return response;
    }
    @RequestMapping("/phone")
    public ResponseEntity<?> phoneLogin(@RequestBody Map<String,Object> requestBody,HttpServletRequest request ) {
        String phone = (String) requestBody.get("phone");
        String password = (String) requestBody.get("password");
        Map<String , Object> response;
        response = loginService.phoneLogin(phone, password);
        if("Login success".equals(response.get("msg"))) {
            // 设置session对象
            HttpSession session = request.getSession();
            session.setAttribute("user", response.get("user"));
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    @Autowired
    private UserMapper userMapper;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> map) {
        String email = map.get("email");
        User user = userMapper.selectUserByEmail(email);
        if (user != null) {
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
                    .body(Map.of("success", false, "message", "该邮箱未注册"));
        }
    }
    @Autowired
    UserService userService;
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("verificationCode");
        String newPassword = requestBody.get("newPassword");
        // 从Redis获取验证码
        String key = "email:code:" + email;
        String savedCode = redisTemplate.opsForValue().get(key);
        if (savedCode != null && savedCode.equals(code)) {
            // 验证成功，删除验证码（可选）
            redisTemplate.delete(key);
            //修改密码逻辑
            String msg = userService.changePassword(email,newPassword);
            if (msg == "success") {
                return ResponseEntity.ok(Map.of(
                        "code", 200,
                        "success", true,
                        "message", "如果该邮箱已注册，我们已发送验证码"));
            }else {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "修改失败"));
            }

        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("验证码错误或已过期");
        }
    }
}
