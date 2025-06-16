package com.xxx.stock_trading_springboot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication

@MapperScan("com.xxx.stock_trading_springboot.Mapper")

public class StockTradingSpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockTradingSpringBootApplication.class, args);
    }

}
