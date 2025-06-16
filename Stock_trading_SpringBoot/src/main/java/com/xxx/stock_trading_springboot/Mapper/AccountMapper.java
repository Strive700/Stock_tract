package com.xxx.stock_trading_springboot.Mapper;

import com.xxx.stock_trading_springboot.Bean.Account;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
@Mapper
public interface AccountMapper {
    void updateTransaction(@Param("accountId") int accountId, @Param("dealPrice") Double dealPrice);
    void updateBuyTransaction(@Param("accountId") int accountId,@Param("dealPrice") Double dealPrice, @Param("expenses") double expenses);
    Account selectByAccountId(int accountId);
    int insertAccount(Account account);
}
