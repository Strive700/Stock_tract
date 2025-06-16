package com.xxx.stock_trading_springboot.Service;

import com.xxx.stock_trading_springboot.Bean.User;

import java.util.Map;

public interface RegisterService {
    Map<String, Object> register(User user);
}
