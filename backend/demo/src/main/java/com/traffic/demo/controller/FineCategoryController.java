package com.traffic.demo.controller;

import com.traffic.demo.dto.FineCategoryRequest;
import com.traffic.demo.entity.FineCategory;
import com.traffic.demo.service.FineCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class FineCategoryController {

    private final FineCategoryService service;

    // ADMIN ONLY ENDPOINTS

    @PostMapping("/api/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public FineCategory create(@RequestBody FineCategoryRequest request) {
        return service.create(request);
    }

    @GetMapping("/api/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public List<FineCategory> getAll() {
        return service.getAll();
    }

    @GetMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FineCategory getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

// PUBLIC / USER ACCESS

    //  GET ALL CATEGORIES FOR DROPDOWN
    @GetMapping("/api/categories")
    public List<FineCategory> getCategoriesForUsers() {
        return service.getAll();
    }

    //  SEARCH CATEGORIES
    @GetMapping("/api/categories/search")
    public List<FineCategory> search(@RequestParam String keyword) {
        return service.search(keyword);
    }
}