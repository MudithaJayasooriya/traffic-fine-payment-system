package com.traffic.demo.controller;
import java.util.List;

import com.traffic.demo.dto.CreateFineRequest;
import com.traffic.demo.dto.FineResponse;
import com.traffic.demo.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin("*")
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

    @GetMapping("/driver/{driverId}")
    public List<FineResponse> getFinesByDriver(@PathVariable Long driverId) {
        return fineService.getFinesByDriver(driverId);
    }

    @GetMapping("/officer/{officerId}")
    public List<FineResponse> getFinesByOfficer(@PathVariable Long officerId) {
        return fineService.getFinesByOfficer(officerId);
    }

    @PutMapping("/{id}")
    public FineResponse updateFine(@PathVariable Long id, @RequestBody CreateFineRequest request) {
        return fineService.updateFine(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFine(@PathVariable Long id) {
        fineService.deleteFine(id);
        return ResponseEntity.ok("Fine deleted successfully.");
    }

    @PutMapping("/{referenceNumber}/mark-paid")
    public ResponseEntity<String> markAsPaid(
            @PathVariable String referenceNumber) {

        fineService.markAsPaid(referenceNumber);
        return ResponseEntity.ok("Fine marked as paid");
    }
}