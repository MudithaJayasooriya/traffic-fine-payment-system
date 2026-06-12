package com.traffic.demo.service;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    List<Payment> getPaymentHistory();
}