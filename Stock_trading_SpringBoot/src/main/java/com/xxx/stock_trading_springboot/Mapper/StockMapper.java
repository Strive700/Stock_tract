package com.xxx.stock_trading_springboot.Mapper;

import com.xxx.stock_trading_springboot.Bean.Stock;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;
@Mapper
public interface StockMapper {
    List<Stock> selectList(Map<String, Object> params);
    int selectOne(Map<String, Object> params);
    @MapKey("tsCode")
    Map<String, Map<String, Object>> selectStockNamesByCodes(@Param("tsCodeList")List<String> tsCodeList);
}
