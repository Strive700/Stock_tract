package com.xxx.stock_trading_springboot.Mapper;

import com.xxx.stock_trading_springboot.Bean.Dtl;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DtlMapper {
    List<Dtl> selectAllDtl(String key,int page ,int pageSize);
    List<Dtl> getStocksByPctChangeGreaterThanZero(String key,int page ,int pageSize);
    List<Dtl> getStocksByPctChangeLessThanZero(String key,int page ,int pageSize);
    List<Dtl>  getTopNStocksByPctChangeDesc(int topN,String key);
    List<Dtl>  getTopNStocksByPctChangeAsc( int topN,String key);
    List<Dtl> selectDtlByName(String key);
    int countselectAllDtl(String key);
    int countselectDtlByPctChangeGreaterThanZero(String key);
    int countselectDtlByPctChangeLessThanZero(String key);
}
