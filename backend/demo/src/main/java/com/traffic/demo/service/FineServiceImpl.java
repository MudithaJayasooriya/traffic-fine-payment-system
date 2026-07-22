package com.traffic.demo.service;

import java.util.List;

import com.traffic.demo.dto.CreateFineRequest;
import com.traffic.demo.dto.FineResponse;
import com.traffic.demo.entity.Fine;
import com.traffic.demo.entity.FineCategory;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.entity.User;
import com.traffic.demo.exception.FineNotFoundException;
import com.traffic.demo.repository.FineCategoryRepository;
import com.traffic.demo.repository.FineRepository;
import com.traffic.demo.repository.PaymentRepository;
import com.traffic.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final FineCategoryRepository categoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SmsService smsService;

    public FineServiceImpl(
            FineRepository fineRepository,
            FineCategoryRepository categoryRepository) {

        this.fineRepository = fineRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public FineResponse createFine(CreateFineRequest request) {

        FineCategory category = categoryRepository
                .findByCategoryCode(request.getCategoryCode())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Fine fine = new Fine();

        fine.setReferenceNumber(
                "FINE-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase());

        fine.setCategory(category);
        fine.setAmount(category.getDefaultAmount());
        fine.setStatus("NOT_PAID");
        fine.setOfficerId(request.getOfficerId());
        fine.setDriverId(request.getDriverId());
        fine.setFineDate(LocalDate.now());
        fine.setDistrict(request.getDistrict() != null && !request.getDistrict().isEmpty() ? request.getDistrict() : "Colombo");

        Fine savedFine = fineRepository.save(fine);

        return new FineResponse(
                savedFine.getId(),
                savedFine.getReferenceNumber(),
                category.getCategoryCode(),
                category.getCategoryName(),
                savedFine.getAmount(),
                savedFine.getStatus(),
                savedFine.getFineDate(),
                savedFine.getOfficerId(),
                savedFine.getDriverId(),
                savedFine.getDistrict()
        );
    }

    @Override
    public FineResponse getFineByReferenceNumber(String referenceNumber) {

        Fine fine = fineRepository
                .findByReferenceNumber(referenceNumber)
                .orElseThrow(() ->
                        new FineNotFoundException("Fine not found"));

        return new FineResponse(
                fine.getId(),
                fine.getReferenceNumber(),
                fine.getCategory().getCategoryCode(),
                fine.getCategory().getCategoryName(),
                fine.getAmount(),
                fine.getStatus(),
                fine.getFineDate(),
                fine.getOfficerId(),
                fine.getDriverId(),
                fine.getDistrict()
        );
    }

    @Override
    public List<FineResponse> getFinesByDriver(Long driverId) {

        List<Fine> fines = fineRepository.findByDriverId(driverId);

        return fines.stream().map(fine ->
                new FineResponse(
                        fine.getId(),
                        fine.getReferenceNumber(),
                        fine.getCategory().getCategoryCode(),
                        fine.getCategory().getCategoryName(),
                        fine.getAmount(),
                        fine.getStatus(),
                        fine.getFineDate(),
                        fine.getOfficerId(),
                        fine.getDriverId(),
                        fine.getDistrict()
                )
        ).toList();
    }

    @Override
    public List<FineResponse> getFinesByOfficer(Long officerId) {

        List<Fine> fines = fineRepository.findByOfficerId(officerId);

        return fines.stream().map(fine ->
                new FineResponse(
                        fine.getId(),
                        fine.getReferenceNumber(),
                        fine.getCategory().getCategoryCode(),
                        fine.getCategory().getCategoryName(),
                        fine.getAmount(),
                        fine.getStatus(),
                        fine.getFineDate(),
                        fine.getOfficerId(),
                        fine.getDriverId(),
                        fine.getDistrict()
                )
        ).toList();
    }

    @Override
    public FineResponse updateFine(Long id, CreateFineRequest request) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new FineNotFoundException("Fine ticket not found: " + id));

        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException("Paid fines cannot be edited.");
        }

        if (request.getCategoryCode() != null && !request.getCategoryCode().isEmpty()) {
            FineCategory category = categoryRepository.findByCategoryCode(request.getCategoryCode())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            fine.setCategory(category);
            fine.setAmount(category.getDefaultAmount());
        }

        if (request.getDriverId() != null) {
            fine.setDriverId(request.getDriverId());
        }

        if (request.getDistrict() != null && !request.getDistrict().isEmpty()) {
            fine.setDistrict(request.getDistrict());
        }

        Fine updated = fineRepository.save(fine);

        return new FineResponse(
                updated.getId(),
                updated.getReferenceNumber(),
                updated.getCategory().getCategoryCode(),
                updated.getCategory().getCategoryName(),
                updated.getAmount(),
                updated.getStatus(),
                updated.getFineDate(),
                updated.getOfficerId(),
                updated.getDriverId(),
                updated.getDistrict()
        );
    }

    @Override
    public void deleteFine(Long id) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new FineNotFoundException("Fine ticket not found: " + id));

        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException("Paid fines cannot be deleted.");
        }

        fineRepository.delete(fine);
    }

    @Override
    public void markAsPaid(String referenceNumber) {
        System.out.println();
        System.out.println("===== PAYMENT COMPLETION =====");
        System.out.println();
        System.out.println("Fine Reference : " + referenceNumber);
        System.out.println();

        Fine fine;
        try {
            fine = fineRepository
                    .findByReferenceNumber(referenceNumber)
                    .orElseThrow(() ->
                            new FineNotFoundException("Fine not found: " + referenceNumber));
        } catch (Exception e) {
            System.out.println("Error: Failed to find fine. Reason: " + e.getMessage());
            System.out.println("==============================");
            throw e;
        }

        try {
            fine.setStatus("PAID");
            fineRepository.save(fine);
        } catch (Exception e) {
            System.out.println("Error: Failed to update fine status. Reason: " + e.getMessage());
            System.out.println("==============================");
            throw e;
        }

        Payment payment;
        Optional<Payment> paymentOpt = paymentRepository.findTopByFineIdAndStatusOrderByPaymentDateDesc(fine.getId(), "PENDING");
        if (paymentOpt.isPresent()) {
            payment = paymentOpt.get();
            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            paymentRepository.saveAndFlush(payment);
        } else {
            payment = new Payment();
            payment.setFineId(fine.getId());
            payment.setAmount(fine.getAmount());
            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            paymentRepository.saveAndFlush(payment);
        }

        System.out.println("Payment ID : " + payment.getPayment_id());
        System.out.println("Status : SUCCESS");
        System.out.println("Fine Updated -> PAID");

        User officer = null;
        try {
            officer = userRepository.findById(fine.getOfficerId()).orElse(null);
        } catch (Exception e) {
            System.out.println("Error: Failed to query officer details. Reason: " + e.getMessage());
        }

        if (officer != null) {
            System.out.println("Officer ID : " + officer.getId());
            String officerPhone = officer.getPhoneNumber();
            System.out.println("Officer Phone : " + (officerPhone != null ? officerPhone : ""));

            if (officerPhone != null && !officerPhone.trim().isEmpty()) {
                String message = "Traffic Fine Payment Successful\n\n"
                        + "Fine Reference: " + fine.getReferenceNumber() + "\n"
                        + "Amount: LKR " + payment.getAmount() + "\n"
                        + "Driver ID: " + fine.getDriverId() + "\n"
                        + "Payment Status: SUCCESS";

                try {
                    smsService.sendSmsToOfficer(officerPhone, message);
                } catch (Exception e) {
                    System.out.println("SMS notification logged: " + e.getMessage());
                }
            } else {
                System.out.println("Officer phone number is empty or null.");
            }
        } else {
            System.out.println("Officer not found for ID: " + fine.getOfficerId());
        }
    }
}