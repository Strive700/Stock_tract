package com.xxx.stock_trading_springboot.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // 标记这是一个配置类
public class WebCORS {
    @Bean  // 注册 WebMvcConfigurer 的 Bean，Spring Boot 启动时会自动加载
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // 所有接口都允许跨域
                        .allowedOrigins("http://localhost:5173")  // 允许前端地址跨域访问
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的请求方法
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

