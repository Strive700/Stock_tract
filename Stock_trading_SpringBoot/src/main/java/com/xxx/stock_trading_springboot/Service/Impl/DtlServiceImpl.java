package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.Dtl;
import com.xxx.stock_trading_springboot.Mapper.DtlMapper;
import com.xxx.stock_trading_springboot.Service.DtlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DtlServiceImpl implements DtlService {
    @Autowired
    private DtlMapper dtlMapper;
    @Override
    public Map<String,Object>getDtl(String filterType, String keyword,int page,int pageSize){
        Map<String,Object>response=new HashMap<>();
        List<Dtl> dtls = new ArrayList<>();
        int totalPositions = 0;
        try {
            switch (filterType) {
                case "全部":
                    dtls = dtlMapper.selectAllDtl(keyword,page,pageSize);
                    totalPositions = dtlMapper.countselectAllDtl(keyword);
                    break;
                case "上涨":
                    // pctChange > 0 的股票
                    dtls = dtlMapper.getStocksByPctChangeGreaterThanZero(keyword,page,pageSize);
                    totalPositions = dtlMapper.countselectDtlByPctChangeGreaterThanZero(keyword);
                    break;
                case "下跌":
                    // pctChange < 0 的股票
                    dtls = dtlMapper.getStocksByPctChangeLessThanZero(keyword,page,pageSize);
                    totalPositions = dtlMapper.countselectDtlByPctChangeLessThanZero(keyword);
                    break;
                case "领涨":
                    // 按 pctChange 降序排列，取前 N 支股票
                    dtls = dtlMapper.getTopNStocksByPctChangeDesc(5,keyword);

                    break;
                case "领跌":
                    // 按 pctChange 升序排列，取前 N 支股票
                    dtls = dtlMapper.getTopNStocksByPctChangeAsc(5,keyword);
                    break;
                default:
                    dtls = dtlMapper.selectAllDtl(keyword,page,pageSize);
                    break;
            }
            response.put("dtls",dtls);
            response.put("msg","success");
            response.put("total", totalPositions);
            response.put("currentPage", page);
        } catch (Exception e) {
            response.put("msg","error");
            throw new RuntimeException(e);
        }
        return response;
    }
}
