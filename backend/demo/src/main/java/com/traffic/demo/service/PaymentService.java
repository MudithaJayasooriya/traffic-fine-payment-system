package com.traffic.demo.service;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    Map<String, String> initiatePayHerePayment(PaymentRequest request);

    void handlePayHereNotification(Map<String, String> data);

    List<Payment> getPaymentHistory();
}