package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.Position;
import com.xxx.stock_trading_springboot.Mapper.PositionMapper;
import com.xxx.stock_trading_springboot.Mapper.StockMapper;
import com.xxx.stock_trading_springboot.Service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PositionServiceImpl implements PositionService {
    @Autowired
    private PositionMapper positionMapper;
    @Autowired
    private StockMapper stockMapper;
    @Override
    public Map<String,Object> getPosition(int accountId,int page,int pageSize){
        Map<String,Object> response=new HashMap<>();
        try {
            List<Position> positions = positionMapper.selectPositionsByAccountId(accountId, page, pageSize);
            int totalPositions = positionMapper.countPositionsByAccountId(accountId);
            //数据库中没有相对应的名字，借助tsCode对应再查找一汴获取name
            List<String> tsCodeList = new ArrayList<>();
            for (Position position : positions) {
                tsCodeList.add(position.getTsCode());
            }
            Map<String, Map<String, Object>> names = stockMapper.selectStockNamesByCodes(tsCodeList);
            response.put("code",200);
            response.put("msg","success");
            response.put("positions",positions);
            response.put("currentPage", page);
            response.put("total", totalPositions);
            response.put("name", names);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return response;
    }
}
