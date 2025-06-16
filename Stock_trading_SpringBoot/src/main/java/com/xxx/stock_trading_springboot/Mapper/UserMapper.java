package com.xxx.stock_trading_springboot.Mapper;

import com.xxx.stock_trading_springboot.Bean.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User selectUserByNickName(String name);
    User selectUserByPhone(String phone);
    void insertUser(User user);
    void updateUser(String username,String nickName,String phone,String sex,int  userId);
    User selectUserByEmail(String email);
    void ChangePasswordByEmail(String email,String password);
}

