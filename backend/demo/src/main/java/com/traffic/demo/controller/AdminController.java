package com.traffic.demo.controller;

import com.traffic.demo.dto.RegisterRequest;
import com.traffic.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/reset-password")
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can reset a user's password
    public ResponseEntity<String> resetPassword(
            @RequestParam String username,
            @RequestParam String newPassword) {
        try {
            String message = authService.resetPasswordByAdmin(username, newPassword);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}