package com.traffic.demo.controller;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // =========================
    // 1. INITIATE PAYMENT (PayHere)
    // =========================
    @PostMapping("/initiate")
    public Map<String, String> initiatePayment(@RequestBody PaymentRequest request) {

        return paymentService.initiatePayHerePayment(request);
    }

    // =========================
    // 2. SAVE PAYMENT (Internal)
    // =========================
    @PostMapping
    public PaymentResponse createPayment(@RequestBody PaymentRequest request) {

        return paymentService.createPayment(request);
    }

    // =========================
    // 3. PAYMENT HISTORY
    // =========================
    @GetMapping("/history")
    public List<Payment> getPaymentHistory() {

        return paymentService.getPaymentHistory();
    }

    // =========================
    // 4. PAYHERE RETURN URL
    // =========================
    @GetMapping("/return")
    public String paymentReturn() {
        return "Payment completed successfully";
    }

    // =========================
    // 5. PAYHERE CANCEL URL
    // =========================
    @GetMapping("/cancel")
    public String paymentCancel() {
        return "Payment cancelled";
    }

    // =========================
    // 6. PAYHERE NOTIFY URL (IMPORTANT)
    // =========================
    @PostMapping("/notify")
    public String paymentNotify(@RequestParam Map<String, String> data) {

        paymentService.handlePayHereNotification(data);
        return "OK";
    }
}