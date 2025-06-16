package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/Stock")
@RestController
public class StockController {
    @Autowired
    private StockService stockService;

    @RequestMapping("/Info")
    public ResponseEntity<Map<String, Object>> stock(@RequestBody Map<String, Object> request) {
        String tsCode = (String) request.get("tsCode");
        String name = (String) request.get("name");
        String marketType = (String) request.get("marketType");
        int page = (int) request.get("page");
        int pageSize = (int) request.get("pageSize");
        int offset = (page - 1) * pageSize; // 分页偏移

        Map<String, Object> result = stockService.getStockInfo(tsCode, name, marketType, page, pageSize, offset);
        return ResponseEntity.ok(result);
    }

    @RequestMapping("/Company")
    public ResponseEntity<Map<String, Object>> Company(@RequestBody Map<String, Object> request) {
        String tsCode = (String) request.get("tsCode");
        Map<String, Object> result = stockService.getStockCompany(tsCode);
        return ResponseEntity.ok(result);
    }

    @RequestMapping("/sell")
    public ResponseEntity<Map<String, Object>> sellStock(@RequestBody Map<String, Object> request) {
        String tsCode = request.get("tsCode").toString();
        String priceStr = request.get("price").toString();
        String quantityStr = request.get("quantity").toString();
        String type = request.get("type").toString();
        String numberStr = request.get("number").toString();
        String transactionDate = request.get("timestamp").toString();
        String orderId = request.get("orderId").toString();
        int userId = (int) request.get("userId");
        int accountId = (int) request.get("accountId");

        double price = Double.parseDouble(priceStr);
        int quantity = Integer.parseInt(quantityStr);
        int number = Integer.parseInt(numberStr);
        Double numberRemain = (double) (number - quantity);

        Map<String, Object> result = stockService.sellStock(tsCode, price, quantity, type, number, transactionDate, orderId, userId, accountId, numberRemain);
        return ResponseEntity.ok(result);
    }

    @RequestMapping("/buy")
    public ResponseEntity<Map<String, Object>> buyStock(@RequestBody Map<String, Object> request) {
        int userId = (int) request.get("userId");
        int accountId = (int) request.get("accountId");
        String tsCode = request.get("tsCode").toString();
        String priceStr = request.get("price").toString();
        String MpriceStr = request.get("marketPrice").toString();
        String quantityStr = request.get("quantity").toString();
        String type = request.get("type").toString();
        String transactionDate = request.get("timestamp").toString();
        String orderId = request.get("orderId").toString();
        String marketValueStr = request.get("marketValue").toString();

        double price = Double.parseDouble(priceStr);
        int quantity = Integer.parseInt(quantityStr);
        Double marketValue = Double.parseDouble(marketValueStr);
        double Mprice = Double.parseDouble(MpriceStr);

        Map<String, Object> result = stockService.buyStock(tsCode, price, quantity, type, transactionDate, orderId, userId, accountId, marketValue, Mprice);
        return ResponseEntity.ok(result);
    }
}
