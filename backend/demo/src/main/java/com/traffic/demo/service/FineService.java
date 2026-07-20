package com.traffic.demo.service;

import java.util.List;

import com.traffic.demo.dto.CreateFineRequest;
import com.traffic.demo.dto.FineResponse;

public interface FineService {

    FineResponse createFine(CreateFineRequest request);

    FineResponse getFineByReferenceNumber(String referenceNumber);

    List<FineResponse> getFinesByDriver(Long driverId);

    List<FineResponse> getFinesByOfficer(Long officerId);

    FineResponse updateFine(Long id, CreateFineRequest request);

    void deleteFine(Long id);

    void markAsPaid(String referenceNumber);
}