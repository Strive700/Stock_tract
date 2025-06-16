package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Mapper.UserMapper;
import com.xxx.stock_trading_springboot.Service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl  implements LoginService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public Map<String,Object > login(String username, String password){
        Map<String, Object> response = new HashMap<>();
        if (username !=null && password!=null ) {
            User user =userMapper.selectUserByNickName(username);

            if (user.getNickName().equals(username) && user.getPassword().equals(password)){
                response.put("code", 200);
                response.put("msg", "Login success");
                response.put("user", user);
            }else {
                response.put("code", 401);
                response.put("msg", "Invalid credentials");
            }
        }else {
            response.put("code", 400);
            response.put("msg", "Username or password cannot be empty");
        }
        return response;
    }
    @Override
    public Map<String,Object > phoneLogin(String phone, String password){
        Map<String, Object> response = new HashMap<>();
        if (phone !=null && password!=null ) {
            User user =userMapper.selectUserByPhone(phone);
            System.out.println(user);
            if (user.getPhone().equals(phone) && user.getPassword().equals(password)){
                response.put("code", 200);
                response.put("msg", "Login success");
                response.put("user", user);
            }else {
                response.put("code", 401);
                response.put("msg", "Invalid credentials");
            }
        }else {
            response.put("code", 400);
            response.put("msg", "Username or password cannot be empty");
        }
        return response;
    }
}
