package com.xxx.stock_trading_springboot.Mapper;

import com.xxx.stock_trading_springboot.Bean.Position;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PositionMapper {
    List<Position> selectPositionsByAccountId(@Param("accountId") int accountId, @Param("page") int page, @Param("pageSize") int pageSize);
    int countPositionsByAccountId(int accountId);
    void updateTransaction(@Param("number") Double number,@Param("tsCode") String tsCode,@Param("accountId") int accountId);
    Position selectPositionByTsCode(@Param("tsCode") String tsCode,@Param("accountId") int accountId);
    void updateBuyTransaction(Position position);
    void insertBuyTransaction(Position position);
    void deleteZero();
}
