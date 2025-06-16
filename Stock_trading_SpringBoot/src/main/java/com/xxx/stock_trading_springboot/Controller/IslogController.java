package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Bean.Account;
import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Mapper.AccountMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class IslogController {
    @Autowired
    private AccountMapper accountMapper;

    @RequestMapping("/isLogin")
    public ResponseEntity<Map<String, Object>> islog(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if (user == null) {
            response.put("status", "error");
            response.put("msg", "notLogin");
            return ResponseEntity.status(401).body(response);
        }

        int accountId = user.getAccountId();
        Account account = accountMapper.selectByAccountId(accountId);

        if (account == null) {
            response.put("status", "error");
            response.put("msg", "notLogin");
            return ResponseEntity.status(401).body(response);
        }

        response.put("status", "success");
        response.put("msg", "success");
        response.put("user", user);
        response.put("account", account);
        return ResponseEntity.ok(response);
    }
}
