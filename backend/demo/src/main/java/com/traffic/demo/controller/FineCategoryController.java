package com.traffic.demo.controller;

import com.traffic.demo.dto.FineCategoryRequest;
import com.traffic.demo.entity.FineCategory;
import com.traffic.demo.service.FineCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FineCategoryController {

    private final FineCategoryService service;

    @PostMapping
    public FineCategory create(
            @RequestBody FineCategoryRequest request) {

        return service.create(request);
    }

    @GetMapping
    public List<FineCategory> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public FineCategory getById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.delete(id);
    }
}