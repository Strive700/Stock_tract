package com.xxx.stock_trading_springboot.Controller;

import com.xxx.stock_trading_springboot.Service.DtlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class DtlController {

    @Autowired
    private DtlService dtlService;

    @RequestMapping("/getDlt")
    public ResponseEntity<Map<String, Object>> getDtl(@RequestBody Map<String, Object> request) {
        try {
            if (!request.containsKey("filterType") || !request.containsKey("keyword")
                    || !request.containsKey("page") || !request.containsKey("pageSize")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "code", "fail",
                        "msg", "Missing required parameters"
                ));
            }

            String filterType = request.get("filterType").toString();
            String keyword = request.get("keyword").toString();
            int page = Integer.parseInt(request.get("page").toString());
            int pageSize = Integer.parseInt(request.get("pageSize").toString());

            Map<String, Object> response = dtlService.getDtl(filterType, keyword, page, pageSize);

            return ResponseEntity.ok(response);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "code", "fail",
                    "msg", "Invalid number format for page or pageSize"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "code", "error",
                    "msg", "Internal server error",
                    "error", e.getMessage()
            ));
        }
    }
}

