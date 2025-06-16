package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @RequestMapping("/getOrder")
    public ResponseEntity<Map<String, Object>> order(@RequestBody Map<String, Object> request) {
        int userId = (int) request.get("userId");
        int page = (int) request.get("page");
        int pageSize = (int) request.get("pageSize");
        int offset = (page - 1) * pageSize; // 分页偏移
        String orderId = (String) request.get("orderNo");
        String tsCode = (String) request.get("tsCode");
        String type = (String) request.get("orderType");
        String status = (String) request.get("OrderStatus");
        String dealDate = (String) request.get("operationDate");

        Map<String, Object> response = orderService.getOrders(userId, page, pageSize, offset, orderId, tsCode, type, status, dealDate);
        return ResponseEntity.ok(response);
    }
}
