package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.Account;
import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Mapper.AccountMapper;
import com.xxx.stock_trading_springboot.Mapper.StockMapper;
import com.xxx.stock_trading_springboot.Mapper.UserMapper;
import com.xxx.stock_trading_springboot.Service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private AccountMapper accountMapper;
    @Override
    public Map<String, Object> register(User user){
        Map<String, Object> response = new HashMap<>();
        //这种办法在高并发的时候容易幻写
        User existingUserByNickName = userMapper.selectUserByNickName(user.getNickName());
        User existingUserByEmail = userMapper.selectUserByEmail(user.getNickName());
        User existingUserByPhone = userMapper.selectUserByPhone(user.getNickName());
        Account account = new Account();
        account.setAsset(20000.0);
        account.setMarketValue(0.0);
        account.setMoneyRest(20000.0);
        if(existingUserByNickName != null){
            response.put("status", "error");
            response.put("code", 409);
            response.put("msg", "用户名已存在");
            return response;
        }else if(existingUserByEmail != null){
            response.put("status", "error");
            response.put("code", 409);
            response.put("msg", "邮箱已存在");
            return response;
        }else if(existingUserByPhone != null){
            response.put("status", "error");
            response.put("code", 409);
            response.put("msg", "手机号已存在");
            return response;
        } else {
            try {
                accountMapper.insertAccount(account);
                user.setAccountId(account.getAccountId());
                userMapper.insertUser(user);
                response.put("code", 200);
                response.put("msg", "Login success");
                response.put("username",user.getName());
            } catch (Exception e) {
                System.out.println(e.getMessage());
                response.put("status", "error");
                response.put("code", 400);
                response.put("msg", "创建错误");
            }

        }
        return response;
    }
}
