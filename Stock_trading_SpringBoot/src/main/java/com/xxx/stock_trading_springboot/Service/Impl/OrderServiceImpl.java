package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.Order;
import com.xxx.stock_trading_springboot.Mapper.OrderMapper;
import com.xxx.stock_trading_springboot.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderMapper orderMapper;
    public Map<String,Object> getOrders(int userId,int page,int pageSize,int offset,String orderId,String tsCode,String type,String status,String dealDate){
        Map<String,Object> response=new HashMap<>();
        try {
            List<Order> orders = orderMapper.selectOrdersByUserId(userId, offset, pageSize,orderId,tsCode,type,status,dealDate);
            int totalOrders = orderMapper.countOrdersByUserId(userId,orderId,tsCode,type,status,dealDate);
            response.put("code", 200);
            response.put("msg", "查询成功");
            response.put("order", orders);
            response.put("total", totalOrders);
            response.put("currentPage", page);
        } catch (NumberFormatException e) {
            response.put("code", 400);
            response.put("msg", "请求参数格式错误: " + e.getMessage());
            response.put("data", null);
            e.printStackTrace();

        }
        return  response;
    }
}
