package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.Company;
import com.xxx.stock_trading_springboot.Bean.Order;
import com.xxx.stock_trading_springboot.Bean.Position;
import com.xxx.stock_trading_springboot.Bean.Stock;
import com.xxx.stock_trading_springboot.Mapper.*;
import com.xxx.stock_trading_springboot.Service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StockServiceImpl implements StockService {
    @Autowired
    private StockMapper stockMapper;
    @Override
    public Map<String,Object> getStockInfo(String tsCode,String name,String marketType,int page,int pageSize,int offset){
        Map<String,Object> response = new HashMap<>();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("tsCode", tsCode);
        paramMap.put("name", name);
        paramMap.put("marketType", marketType);
        paramMap.put("offset", offset);
        paramMap.put("pageSize", pageSize);
        List<Stock> stockList = stockMapper.selectList(paramMap);
        int total = stockMapper.selectOne( paramMap);
        Map<String, Object> data = new HashMap<>();
        data.put("items", stockList);
        data.put("total", total);
        data.put("page", page);
        response.put("code", 200);
        response.put("msg", stockList.isEmpty() ? "没有找到相关数据" : "查询成功");
        response.put("data", data);
        return  response;
    }

    @Autowired
    private CompanyMapper companyMapper;
    @Override
    public Map<String, Object> getStockCompany(String tsCode) {
        Map<String,Object> response = new HashMap<>();
        Company company = companyMapper.selectone(tsCode);
        if(company != null){
            response.put("code",200);
            response.put("company", company);
            response.put("msg","查询成功");
        }else {
            response.put("code",400);
            response.put("msg","查询失败");
        }
        return response;
    }
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private PositionMapper positionMapper;
    @Override
    public Map<String, Object> sellStock(String tsCode,Double price,int quantity,String type,int number,String transactionDate,
                                         String orderId,int userId,int accountId,Double numberRemain){
        Map<String,Object> response = new HashMap<>();
        // 解析为 Instant（UTC时间点）
        Instant instant = Instant.parse(transactionDate);
        // 转换为本地时区时间（如东八区）
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of("Asia/Shanghai"));
        // 格式化为目标字符串
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = zonedDateTime.format(formatter);
        Double dealPrice = price * quantity;
        Order order = new Order();
        order.setOrderId(orderId);
        order.setUserId(userId);
        order.setTsCode(tsCode);
        order.setDealNumber((double) quantity);
        order.setType(type);
        order.setDealPrice(dealPrice);
        order.setDealValue(price * quantity);
        order.setDealDate(formattedTime);
        order.setStatus("finish");
        try {
            positionMapper.updateTransaction(numberRemain, tsCode,accountId);
            orderMapper.insertTransaction(order);
            accountMapper.updateTransaction(accountId,dealPrice);
            positionMapper.deleteZero();
            response.put("code",200);
            response.put("msg","success");
        } catch (Exception e) {
            response.put("code",400);
            response.put("msg","委托提交失败，请稍后重试");
            throw new RuntimeException(e);
        }
        return  response;
    }
    @Override
    public Map<String, Object> buyStock(String tsCode, Double price, int quantity, String type, String transactionDate,
                                        String orderId, int userId, int accountId,Double marketValue,double Mprice){

        Map<String,Object> response = new HashMap<>();
        Instant instant = Instant.parse(transactionDate);
        // 转换为本地时区时间（如东八区）
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of("Asia/Shanghai"));
        // 格式化为目标字符串
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = zonedDateTime.format(formatter);
        Double dealPrice = price * quantity;
        // 封装 Order 对象
        Order order = new Order();
        order.setOrderId(orderId);
        order.setUserId(userId);
        order.setTsCode(tsCode);
        order.setDealNumber((double) quantity);
        order.setType(type);
        order.setDealPrice(dealPrice);
        order.setDealValue(price * quantity);
        order.setDealDate(formattedTime);
        order.setStatus("finished");
        try {
            Position position = positionMapper.selectPositionByTsCode(tsCode,accountId);
            //如果该用户持仓中有该股票则对该股票进行更新数据库
            if (position != null) {
                //传入position对象进行更新
                Double number= position.getNumber();
                System.out.println("<UNK>"+number);
                number=number+quantity;
                System.out.println(number);
                Double cost = position.getCost();
                cost=cost+(price*quantity);
                position.setDealPrice(cost/number);
                position.setMarketValue(number*position.getMarketPrice());
                position.setProfitLoss(position.getMarketValue()-cost);
                position.setDealTime(formattedTime);
                position.setNumber(number);
                positionMapper.updateBuyTransaction(position);
            } else{
                //假设持仓中没有该股票
                position = new Position();
                position.setDealTime(formattedTime);
                position.setMarketPrice(Mprice);
                position.setAccountId(accountId);
                position.setTsCode(tsCode);
                position.setDealPrice(price);
                position.setNumber((double) quantity);
                position.setCost(price*quantity);
                position.setMarketValue(Mprice*quantity);
                position.setProfitLoss(position.getMarketValue()-(price*quantity));
                positionMapper.insertBuyTransaction(position);
            }
            //更新订单
            orderMapper.insertTransaction(order);
            //更新账户信息
            accountMapper.updateBuyTransaction(accountId,dealPrice,(Mprice*quantity));
            response.put("code",200);
            response.put("msg","success");
            response.put("success", true);
        } catch (Exception e) {
            response.put("code",400);
            response.put("success", false);
            response.put("msg","委托提交失败，请稍后重试");
            throw new RuntimeException(e);
        }
        return response;
    }
}
