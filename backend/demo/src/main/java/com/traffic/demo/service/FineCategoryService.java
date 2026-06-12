package com.traffic.demo.service;

import com.traffic.demo.dto.FineCategoryRequest;
import com.traffic.demo.entity.FineCategory;
import com.traffic.demo.repository.FineCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FineCategoryService {

    private final FineCategoryRepository repository;

    public FineCategory create(
            FineCategoryRequest request) {

        FineCategory category =
                FineCategory.builder()
                        .categoryCode(request.getCategoryCode())
                        .categoryName(request.getCategoryName())
                        .description(request.getDescription())
                        .defaultAmount(request.getDefaultAmount())
                        .active(true)
                        .build();

        return repository.save(category);
    }

    public List<FineCategory> getAll() {
        return repository.findAll();
    }

    public FineCategory getById(Long id) {
        return repository.findById(id)
                .orElseThrow();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}