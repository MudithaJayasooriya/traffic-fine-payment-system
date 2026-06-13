package com.traffic.demo.service;

import com.traffic.demo.dto.CreateFineRequest;
import com.traffic.demo.dto.FineResponse;
import com.traffic.demo.entity.Fine;
import com.traffic.demo.entity.FineCategory;
import com.traffic.demo.exception.FineNotFoundException;
import com.traffic.demo.repository.FineCategoryRepository;
import com.traffic.demo.repository.FineRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final FineCategoryRepository categoryRepository;

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

        Fine savedFine = fineRepository.save(fine);

        return new FineResponse(
                savedFine.getReferenceNumber(),
                category.getCategoryCode(),
                category.getCategoryName(),
                savedFine.getAmount(),
                savedFine.getStatus(),
                savedFine.getFineDate(),
                savedFine.getOfficerId(),
                savedFine.getDriverId()
        );
    }

    @Override
    public FineResponse getFineByReferenceNumber(String referenceNumber) {

        Fine fine = fineRepository
                .findByReferenceNumber(referenceNumber)
                .orElseThrow(() ->
                        new FineNotFoundException("Fine not found"));

        return new FineResponse(
                fine.getReferenceNumber(),
                fine.getCategory().getCategoryCode(),
                fine.getCategory().getCategoryName(),
                fine.getAmount(),
                fine.getStatus(),
                fine.getFineDate(),
                fine.getOfficerId(),
                fine.getDriverId()
        );
    }
}