package com.xxx.stock_trading_springboot.Service.Impl;

import com.xxx.stock_trading_springboot.Bean.User;
import com.xxx.stock_trading_springboot.Mapper.UserMapper;
import com.xxx.stock_trading_springboot.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UserServiceImpl implements UserService {
    @Value("${avatar.upload-dir}")
    private String uploadDir;

    @Override
    public String saveUserAvatar(MultipartFile file, String userId) {
        // 自定义保存路径及文件名
        String filename = "avatar_" + userId + ".png";
        Path filepath = Paths.get(uploadDir, filename);
        try {
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("保存头像失败", e);
        }
    }

    @Autowired
    private UserMapper userMapper;
    @Override
    public String updataUser(String username,String nickName,String phone,String sex,String userId_String){
        int userId = Integer.parseInt(userId_String);
        try {
            userMapper.updateUser(username,nickName,phone,sex,userId);
            return "success";
        } catch (Exception e) {
            return "fail";
        }
    }
    //修改密码
    @Override
    public String changePassword(String email, String newPassword) {
        try {
            userMapper.ChangePasswordByEmail(email,newPassword);
            return "success";
        } catch (Exception e) {
            return "fail";
        }
    }
}
