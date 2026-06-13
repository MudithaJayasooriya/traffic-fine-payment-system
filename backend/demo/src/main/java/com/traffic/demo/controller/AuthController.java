package com.traffic.demo.controller;

import com.traffic.demo.dto.*;
import com.traffic.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Use specific origin instead of '*'
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Existing generic login (Keep this for Mobile/Admin Portal)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // NEW: Specific endpoint for the Driver Web Portal
    @PostMapping("/driver/login")
    public ResponseEntity<?> driverLogin(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        // Fetch user details to verify the role
        // Assuming your AuthService or a UserRepository can get the user by username
        var user = authService.getUserByUsername(request.getUsername());

        if (!"DRIVER".equals(user.getRole().name())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: This portal is only for Drivers.");
        }

        return ResponseEntity.ok(response);
    }
}