package com.xxx.stock_trading_springboot;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class RedisTest {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testRedisSetAndGet() {
        // 设置一个键值对
        stringRedisTemplate.opsForValue().set("test-key", "hello redis");

        // 读取刚才的值
        String value = stringRedisTemplate.opsForValue().get("test-key");

        // 断言值是否正确
        assertEquals("hello redis", value);

        System.out.println("Redis 测试通过，取到的值是：" + value);
    }
}

