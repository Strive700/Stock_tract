package com.xxx.stock_trading_springboot.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.*;
@RequestMapping("/api")
@RestController
public class MarketInfoController {

    @Autowired
    private RestTemplate restTemplate;

    // 腾讯财经接口：返回纯文本
    private static final String TENCENT_URL = "https://qt.gtimg.cn/q=sh000001,sz399001,sz399006";

    @GetMapping("/market")
    public ResponseEntity<?> getMarketIndex() {
        try {
            String response = restTemplate.getForObject(TENCENT_URL, String.class);
            if (response == null) {
                return ResponseEntity.status(500).body(Map.of("msg", "获取腾讯指数失败"));
            }
            String[] lines = response.split(";");
            List<Map<String, String>> result = new ArrayList<>();
            for (String line : lines) {
                if (!line.contains("=")) continue;
                String content = line.substring(line.indexOf("\"") + 1, line.lastIndexOf("\""));
                String[] parts = content.split("~");
                if (parts.length > 5) {
                    Map<String, String> index = new HashMap<>();
                    index.put("name", parts[1]);
                    index.put("price", parts[3]);
                    index.put("change", parts[31]);
                    index.put("percent", parts[32] + "%");
                    result.add(index);
                }
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("msg", "调用腾讯财经失败", "error", e.getMessage()));
        }
    }
    private static final String JUHESHUJU_URL = "http://apis.juhe.cn/fapigx/caijing/query";
    private static final String API_KEY = "74d567c96e28ef5f28e48296870467f4";

    @GetMapping("/getNews")
    public ResponseEntity<?> getNews() {
        try {
            HashMap<String, String> map = new HashMap<>();
            map.put("key", API_KEY);
            map.put("num", "5");
            // 还可以加page，rand
            URL url = new URL(String.format("%s?%s", JUHESHUJU_URL, params(map)));
            BufferedReader in = new BufferedReader(new InputStreamReader((url.openConnection()).getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("请求失败：" + e.getMessage());
        }
    }
    private static String params(Map<String, String> map) {
        return map.entrySet().stream()
                .map(entry -> {
                    try {
                        return entry.getKey() + "=" + URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                        return entry.getKey() + "=" + entry.getValue();
                    }
                })
                .collect(Collectors.joining("&"));
    }
}
