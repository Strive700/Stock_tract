package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Service.AccountService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;

    @RequestMapping("/getAccount")
    public ResponseEntity<Map<String, Object>> account(@RequestBody Map<String, Object> request, HttpSession session) {
        Integer accountId = (Integer) request.get("accountId");
        if (accountId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "code", "fail",
                    "msg", "accountId is required"
            ));
        }
        Map<String, Object> response = accountService.getAccount(accountId);
        if ("success".equals(response.get("code"))) {
            session.setAttribute("account", response.get("account"));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

