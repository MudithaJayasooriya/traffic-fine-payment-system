package com.traffic.demo.service;

import com.traffic.demo.dto.PaymentRequest;
import com.traffic.demo.dto.PaymentResponse;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.entity.Fine;
import com.traffic.demo.entity.User;
import com.traffic.demo.repository.PaymentRepository;
import com.traffic.demo.repository.FineRepository;
import com.traffic.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${PAYHERE_MERCHANT_ID}")
    private String merchantId;

    @Value("${PAYHERE_MERCHANT_SECRET}")
    private String merchantSecret;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private UserRepository userRepository;

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
    @Transactional
    public Map<String, String> initiatePayHerePayment(PaymentRequest request) {

        System.out.println("Initiating PayHere payment request for Fine ID: " + request.getFineId());

        // Create and save a new PENDING Payment record to database
        Payment payment = new Payment();
        payment.setFineId(request.getFineId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "PayHere");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("PENDING");

        payment = paymentRepository.save(payment);
        System.out.println("Created pending payment record. Payment ID: " + payment.getPayment_id());

        Map<String, String> data = new HashMap<>();

        String orderId   = "ORDER_" + payment.getPayment_id();
        String amount    = String.format("%.2f", request.getAmount());
        String currency  = "LKR";

        // Generate PayHere Hash
        String hashedSecret = md5(merchantSecret).toUpperCase();
        String hashString   = merchantId + orderId + amount + currency + hashedSecret;
        String hash         = md5(hashString).toUpperCase();

        // PayHere credentials
        data.put("merchant_id",     merchantId);
        data.put("merchant_secret", merchantSecret);
        data.put("order_id",        orderId);
        data.put("amount",          amount);
        data.put("currency",        currency);
        data.put("hash",            hash);

        // Customer details
        data.put("first_name", request.getFirstName());
        data.put("last_name",  request.getLastName());
        data.put("email",      request.getEmail());
        data.put("phone",      request.getPhone());
        data.put("address",    request.getAddress());
        data.put("city",       request.getCity());

        // PayHere callback URLs
        data.put("notify_url", "http://10.0.2.2:8080/api/payments/notify");
        data.put("return_url", "http://10.0.2.2:8080/api/payments/return");
        data.put("cancel_url", "http://10.0.2.2:8080/api/payments/cancel");

        System.out.println("PayHere payment initiated: order_id=" + orderId + ", amount=" + amount);

        return data;
    }


    @Override
    @Transactional
    public void handlePayHereNotification(Map<String, String> data) {

        System.out.println("received PayHere notification data: " + data);

        String orderId = data.get("order_id");
        String status  = data.get("status_code");

        System.out.println("order_id: " + orderId);

        if (orderId == null || status == null) {
            System.out.println("Error: Missing order_id or status_code");
            return;
        }

        Long parsedId;

        try {
            parsedId = Long.parseLong(orderId.replace("ORDER_", ""));
        } catch (Exception e) {
            System.out.println("Exception parsing order_id: " + e.getMessage());
            return;
        }

        Payment payment = null;

        // 1. Try to find Payment associated with parsedId as fineId
        try {
            List<Payment> paymentsByFine = paymentRepository.findByFineId(parsedId);
            if (paymentsByFine != null && !paymentsByFine.isEmpty()) {
                payment = paymentsByFine.stream()
                        .filter(p -> "PENDING".equals(p.getStatus()))
                        .findFirst()
                        .orElse(paymentsByFine.get(paymentsByFine.size() - 1));
            }
        } catch (Exception e) {
            System.out.println("Exception looking up payment by fineId: " + e.getMessage());
        }

        // 2. If not found, try looking up by parsedId as payment_id (primary key)
        if (payment == null) {
            try {
                Optional<Payment> paymentOpt = paymentRepository.findById(parsedId);
                if (paymentOpt.isPresent()) {
                    payment = paymentOpt.get();
                }
            } catch (Exception e) {
                System.out.println("Exception looking up payment by primary key: " + e.getMessage());
            }
        }

        if (payment == null) {
            System.out.println("Error: Payment not found for parsed ID " + parsedId);
            return;
        }

        System.out.println("payment id found: " + payment.getPayment_id());

        String oldStatus = payment.getStatus();
        System.out.println("old payment status: " + oldStatus);

        // Idempotency: skip if already marked as SUCCESS
        if ("SUCCESS".equals(payment.getStatus())) {
            System.out.println("updated payment status: SUCCESS (already updated)");
            System.out.println("Payment ID " + payment.getPayment_id() + " is already SUCCESS. Skipping update and SMS to avoid duplicates.");
            return;
        }

        if ("2".equals(status)) {

            System.out.println("Processing successful payment for Payment ID: " + payment.getPayment_id());

            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            try {
                payment = paymentRepository.saveAndFlush(payment);
                System.out.println("updated payment status: " + payment.getStatus());
                System.out.println("payment saved successfully: payment_id=" + payment.getPayment_id());
            } catch (Exception e) {
                System.out.println("Exception saving payment entity: " + e.getMessage());
                throw e; // roll back transaction
            }

            // Update fine status to PAID
            Optional<Fine> fineOpt = fineRepository.findById(payment.getFineId());
            if (fineOpt.isEmpty()) {
                System.out.println("Error: Fine not found for fineId=" + payment.getFineId());
                return;
            }

            Fine fine = fineOpt.get();
            System.out.println("fine found: fineId=" + fine.getId() + ", referenceNumber=" + fine.getReferenceNumber() + ", status=" + fine.getStatus());

            fine.setStatus("PAID");
            try {
                fineRepository.saveAndFlush(fine);
                System.out.println("Fine status updated and saved successfully to PAID");
            } catch (Exception e) {
                System.out.println("Exception saving fine entity: " + e.getMessage());
                throw e; // roll back transaction
            }

            // Send SMS to officer
            Optional<User> officerOpt = userRepository.findById(fine.getOfficerId());
            if (officerOpt.isEmpty()) {
                System.out.println("Error: officer not found for officerId=" + fine.getOfficerId());
            } else {
                User officer = officerOpt.get();
                System.out.println("officer found: officerId=" + officer.getId() + ", username=" + officer.getUsername());

                String officerPhone = officer.getPhoneNumber();
                System.out.println("officer phone number: " + officerPhone);

                if (officerPhone == null || officerPhone.trim().isEmpty()) {
                    System.out.println("Error: officer phone number is empty");
                } else {
                    String message = "Traffic Fine Payment Received.\n"
                            + "Fine Reference: " + fine.getReferenceNumber() + "\n"
                            + "Amount: LKR " + String.format("%.2f", payment.getAmount()) + "\n"
                            + "Payment Status: SUCCESS";

                    try {
                        System.out.println("SMS request sent: phone=" + officerPhone + ", message=" + message.replace("\n", " "));
                        smsService.sendSmsToOfficer(officerPhone, message);
                        System.out.println("SMS response: SMS sent successfully");
                    } catch (Exception e) {
                        System.out.println("SMS response: SMS sending failed: Exception=" + e.getMessage());
                    }
                }
            }

        } else {

            System.out.println("Processing failed payment for Payment ID: " + payment.getPayment_id());

            payment.setStatus("FAILED");
            payment.setPaymentDate(LocalDateTime.now());
            try {
                payment = paymentRepository.saveAndFlush(payment);
                System.out.println("updated payment status: " + payment.getStatus());
                System.out.println("payment saved successfully: payment_id=" + payment.getPayment_id());
            } catch (Exception e) {
                System.out.println("Exception saving payment entity: " + e.getMessage());
                throw e;
            }
        }
    }


    @Override
    public List<Payment> getPaymentHistory() {
        return paymentRepository.findAll();
    }


    /*
     * MD5 Generator for PayHere Hash
     */
    private String md5(String input) {

        try {

            java.security.MessageDigest md =
                    java.security.MessageDigest.getInstance("MD5");

            byte[] messageDigest = md.digest(input.getBytes());

            StringBuilder hexString = new StringBuilder();

            for (byte b : messageDigest) {

                String hex = Integer.toHexString(0xff & b);

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(hex);
            }

            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}