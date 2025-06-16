package com.xxx.stock_trading_springboot.Service;

import java.util.Map;

public interface StockService {
    Map<String, Object> getStockInfo(String tsCode,String name,String marketType,int page,int pageSize,int offset);
    Map<String, Object> getStockCompany(String tsCode);
    Map<String, Object> sellStock(String tsCode,Double price,int quantity,String type,int number,String transactionDate,
                                  String orderId,int userId,int accountId,Double numberRemain);

    Map<String, Object> buyStock(String tsCode, Double price, int quantity, String type, String transactionDate,
                                 String orderId, int userId, int accountId,Double marketValue,double Mprice);
}
