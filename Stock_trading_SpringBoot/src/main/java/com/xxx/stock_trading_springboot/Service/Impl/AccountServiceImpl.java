package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.Account;
import com.xxx.stock_trading_springboot.Mapper.AccountMapper;
import com.xxx.stock_trading_springboot.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountMapper accountMapper;
    @Override
    public Map<String,Object> getAccount(Integer accountId){
        Map<String,Object> response = new HashMap<>();
        if(accountId==null){
            response.put("code",400);
            response.put("msg","没有该账户");
        }else{
            Account account = accountMapper.selectByAccountId(accountId);
            response.put("code",200);
            response.put("msg","success");
            response.put("account",account);
        }
        return response;
    }
}
