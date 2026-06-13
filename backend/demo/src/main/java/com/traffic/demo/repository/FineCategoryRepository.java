package com.traffic.demo.repository;

import com.traffic.demo.entity.FineCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FineCategoryRepository
        extends JpaRepository<FineCategory, Long> {

    boolean existsByCategoryCode(String categoryCode);
}