package com.traffic.demo.controller;

import com.traffic.demo.dto.RegisterRequest;
import com.traffic.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.traffic.demo.entity.Role;
import com.traffic.demo.entity.User;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;

    @PostMapping("/register-officer")
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can access this endpoint
    public ResponseEntity<String> registerOfficer(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerOfficerByAdmin(request));
    }

}

