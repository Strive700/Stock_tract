package com.xxx.stock_trading_springboot.Service;

import com.xxx.stock_trading_springboot.Bean.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.multipart.MultipartFile;

@Mapper
public interface UserService {
    String saveUserAvatar(MultipartFile file, String userId);
    String updataUser(String username,String nickName,String phone,String sex,String userId);

    //修改密码
    String changePassword (String passWord, String newPassword);
}
