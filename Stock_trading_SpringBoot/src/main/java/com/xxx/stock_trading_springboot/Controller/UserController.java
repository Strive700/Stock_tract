package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
@RestController
public class UserController {
    @Autowired
    UserService userService;
    @RequestMapping("/uploadAvatar")
    public Map<String,Object> UserImageController(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Map<String,Object> response = new HashMap<>();
        HttpSession session = request.getSession();
        User user  = (User) session.getAttribute("user");
        String username = null;
        if(user == null) {
            response.put("status", "error");
            response.put("message", "Session错误");
            response.put("code", 402);
            return response;
        }else{
             username = user.getNickName();
        }
        String msg = userService.saveUserAvatar(file,username);
        response.put("status", "success");
        response.put("avatar", msg);
        response.put("msg", "success");
        response.put("code", 200);
        return response;
    }
    @RequestMapping("/updateUserInfo")
    public Map<String,Object> updateUser(@RequestBody Map<String,Object> request){
        Map<String,Object> response = new HashMap<>();
        String username = request.get("name").toString();
        String nickName = request.get("nickName").toString();
        String phone = request.get("phone").toString();
        String sex = request.get("sex").toString();
        String userId = request.get("userId").toString();
        String msg = userService.updataUser(username,nickName,phone,sex,userId);
        if(msg == "success"){
            response.put("status", "success");
            response.put("msg", msg);
            response.put("code", 200);
        }else{
            response.put("status", "error");
            response.put("message", msg);
            response.put("code", 402);
        }
        return response;
    }
}
