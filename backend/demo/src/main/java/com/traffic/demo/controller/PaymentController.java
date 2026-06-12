package com.traffic.demo.controller;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public PaymentResponse createPayment(
            @RequestBody PaymentRequest request) {

        return paymentService.createPayment(request);
    }

    @GetMapping("/history")
    public List<Payment> getPaymentHistory() {

        return paymentService.getPaymentHistory();
    }
}