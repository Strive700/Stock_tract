package com.xxx.stock_trading_springboot.Service;

import java.util.Map;

public interface LoginService {
    Map<String,Object> login(String username, String password);

    Map<String,Object > phoneLogin(String phone, String password);
}
