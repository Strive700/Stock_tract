package com.xxx.stock_trading_springboot.Service;

import java.util.Map;

public interface DtlService {
    Map<String,Object>getDtl(String filterType, String keyword,int page,int pageSize);
}
