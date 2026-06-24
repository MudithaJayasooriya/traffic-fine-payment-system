package com.traffic.demo.controller;

import com.traffic.demo.entity.User;
import com.traffic.demo.entity.Role;
import com.traffic.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // GET USER BY ID (Officer fetch)
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET ALL OFFICERS
    @GetMapping("/officers")
    public List<User> getOfficers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.OFFICER)
                .toList();
    }

    // GET ALL DRIVERS
    @GetMapping("/drivers")
    public List<User> getDrivers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.DRIVER)
                .toList();
    }

    // SEARCH USERS (Driver + Officer)
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String keyword) {
        return userRepository.findAll()
                .stream()
                .filter(u ->
                        u.getUsername().toLowerCase().contains(keyword.toLowerCase())
                                && (u.getRole() == Role.DRIVER || u.getRole() == Role.OFFICER)
                )
                .toList();
    }
}