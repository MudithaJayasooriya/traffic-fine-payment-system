package com.traffic.demo.dto;

import com.traffic.demo.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
    private String nicNumber;
    private String phoneNumber;
}