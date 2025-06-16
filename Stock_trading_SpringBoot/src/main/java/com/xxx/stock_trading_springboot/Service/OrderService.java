package com.xxx.stock_trading_springboot.Service;

import java.util.Map;

public interface OrderService {
    Map<String,Object> getOrders(int userId,int page,int pageSize,int offset,String orderId,String tsCode,String type,String status,String dealDate);
}
