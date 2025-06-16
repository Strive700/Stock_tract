package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class PositionController {

    @Autowired
    private PositionService positionService;

    @RequestMapping("/getPosition")
    public ResponseEntity<Map<String, Object>> position(@RequestBody Map<String, Object> request) {
        int accountId = (int) request.get("accountId");
        int page = (int) request.get("page");
        int pageSize = (int) request.get("pageSize");

        Map<String, Object> response = positionService.getPosition(accountId, page, pageSize);
        return ResponseEntity.ok(response);
    }
}

