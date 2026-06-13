package com.traffic.demo.service;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SmsService smsService;


    @Override
    public PaymentResponse createPayment(PaymentRequest request) {

        Payment payment = new Payment();

        payment.setFineId(request.getFineId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("PENDING");

        paymentRepository.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setMessage("Payment created successfully");

        return response;
    }


    @Override
    public Map<String, String> initiatePayHerePayment(PaymentRequest request) {

        Map<String, String> data = new HashMap<>();

        data.put("order_id", "ORDER_" + request.getFineId());
        data.put("amount", String.valueOf(request.getAmount()));
        data.put("currency", "LKR");

        data.put("first_name", request.getFirstName());
        data.put("last_name", request.getLastName());
        data.put("email", request.getEmail());
        data.put("phone", request.getPhone());
        data.put("address", request.getAddress());
        data.put("city", request.getCity());

        data.put("return_url", "http://localhost:8080/api/payments/return");
        data.put("cancel_url", "http://localhost:8080/api/payments/cancel");
        data.put("notify_url", "http://localhost:8080/api/payments/notify");

        return data;
    }


    @Override
    public void handlePayHereNotification(Map<String, String> data) {

        String orderId = data.get("order_id");
        String status = data.get("status_code");

        if (orderId == null || status == null) {
            return; // safety check
        }

        Long paymentId;

        try {
            paymentId = Long.parseLong(orderId.replace("ORDER_", ""));
        } catch (Exception e) {
            System.out.println("Invalid order ID");
            return;
        }

        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);

        if (paymentOpt.isEmpty()) {
            return;
        }

        Payment payment = paymentOpt.get();


        if ("2".equals(status)) {

            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());

            paymentRepository.save(payment);


            String officerPhone = "94703376797"; // TODO: replace with DB later

            String message =
                    "Traffic Fine Paid Successfully\n"
                            + "Fine ID: " + payment.getFineId()
                            + "\nAmount: " + payment.getAmount();

            try {
                smsService.sendSmsToOfficer(officerPhone, message);
            } catch (Exception e) {
                System.out.println("SMS failed: " + e.getMessage());
            }

        } else {

            payment.setStatus("FAILED");
            payment.setPaymentDate(LocalDateTime.now());
            paymentRepository.save(payment);
        }
    }


    @Override
    public List<Payment> getPaymentHistory() {
        return paymentRepository.findAll();
    }
}