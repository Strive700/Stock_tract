package com.xxx.stock_trading_springboot.Mapper;

import com.xxx.stock_trading_springboot.Bean.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface OrderMapper {
    Order selectOrderById(int id);

    List<Order> selectOrdersByUserId(@Param("userId") int userId, @Param("page") int page, @Param("pageSize") int pageSize, @Param("orderId") String orderId, @Param("tsCode") String tsCode, @Param("type") String type, @Param("status") String status, @Param("dealDate")String dealDate);
    int countOrdersByUserId(@Param("userId") int userId,@Param("orderId") String orderId,@Param("tsCode") String tsCode,@Param("type") String type,@Param("status") String status,@Param("dealDate")String dealDate);

    void insertTransaction(Order order);
}
