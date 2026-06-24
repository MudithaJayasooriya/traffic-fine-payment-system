package com.traffic.demo.service;

import com.traffic.demo.dto.*;
import com.traffic.demo.entity.User;
import com.traffic.demo.entity.Role;
import com.traffic.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // Helper method to retrieve user (Used by AuthController for role validation)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // Public Route - Strictly for DRIVER role signups
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.OFFICER) {
            throw new IllegalArgumentException("Registration denied: Traffic Officers can only be registered by an Admin.");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.DRIVER);
        user.setNicNumber(request.getNicNumber());
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    // Admin Route - Invoked by an Admin feature to create Officers
    public String registerOfficerByAdmin(RegisterRequest request) {
        String inputUsername = request.getUsername();

        if (inputUsername == null || !inputUsername.contains("_")) {
            throw new IllegalArgumentException("Invalid username format. Officer username must include both name and badge number separated by an underscore.");
        }

        if (userRepository.findByUsername(inputUsername).isPresent()) {
            throw new IllegalArgumentException("Officer username '" + inputUsername + "' already exists.");
        }

        User officer = new User();
        officer.setUsername(inputUsername);
        officer.setEmail(request.getEmail());
        officer.setPassword(passwordEncoder.encode(request.getPassword()));
        officer.setRole(Role.OFFICER);
        officer.setNicNumber(request.getNicNumber());
        officer.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(officer);
        return "Traffic Officer registered successfully with username: " + inputUsername;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = getUserByUsername(request.getUsername());
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

// GET USERS BY ROLE
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}