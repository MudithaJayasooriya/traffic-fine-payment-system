package com.traffic.demo.repository;

import com.traffic.demo.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    Optional<Fine> findByReferenceNumber(String referenceNumber);
}