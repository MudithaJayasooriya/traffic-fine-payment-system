package com.traffic.demo.repository;

import com.traffic.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByFineId(Long fineId);
    List<Payment> findByFineIdAndStatus(Long fineId, String status);
    Optional<Payment> findTopByFineIdAndStatusOrderByPaymentDateDesc(Long fineId, String status);
}