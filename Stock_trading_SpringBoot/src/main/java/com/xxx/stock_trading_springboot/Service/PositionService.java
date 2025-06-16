package com.xxx.stock_trading_springboot.Service;

import java.util.Map;

public interface PositionService {
    Map<String, Object> getPosition(int accountId,int page,int pageSize);
}
