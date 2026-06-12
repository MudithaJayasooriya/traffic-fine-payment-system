package com.traffic.demo.controller;

import com.traffic.demo.dto.CreateFineRequest;
import com.traffic.demo.dto.FineResponse;
import com.traffic.demo.service.FineService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @PostMapping
    public FineResponse createFine(
            @RequestBody CreateFineRequest request) {

        return fineService.createFine(request);
    }

    @GetMapping("/{referenceNumber}")
    public FineResponse getFine(
            @PathVariable String referenceNumber) {

        return fineService.getFineByReferenceNumber(referenceNumber);
    }
}