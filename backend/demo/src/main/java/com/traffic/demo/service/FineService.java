package com.traffic.demo.service;

import com.traffic.demo.dto.CreateFineRequest;
import com.traffic.demo.dto.FineResponse;

public interface FineService {

    FineResponse createFine(CreateFineRequest request);

    FineResponse getFineByReferenceNumber(String referenceNumber);
}