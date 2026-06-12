package com.traffic.demo.service;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public PaymentResponse createPayment(PaymentRequest request) {

        Payment payment = new Payment();

        payment.setFineId(request.getFineId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDate(LocalDateTime.now());

        // PayHere result
        payment.setStatus("PENDING");

        Payment savedPayment = paymentRepository.save(payment);

        return new PaymentResponse(
                savedPayment.getPayment_id(),
                savedPayment.getStatus(),
                "Payment created successfully"
        );
    }

    @Override
    public List<Payment> getPaymentHistory() {
        return paymentRepository.findAll();
    }
}