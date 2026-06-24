package com.traffic.demo.repository;

import com.traffic.demo.entity.FineCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface FineCategoryRepository
        extends JpaRepository<FineCategory, Long> {

    boolean existsByCategoryCode(String categoryCode);

    Optional<FineCategory> findByCategoryCode(String categoryCode);
    List<FineCategory> findByCategoryCodeContainingIgnoreCaseOrCategoryNameContainingIgnoreCase(
            String code,
            String name
    );
}