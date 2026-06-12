package com.traffic.demo.dto;

import java.time.LocalDate;

public class FineResponse {

    private String referenceNumber;
    private String violationName;
    private Double amount;
    private String status;
    private LocalDate fineDate;

    public FineResponse() {
    }

    public FineResponse(
            String referenceNumber,
            String violationName,
            Double amount,
            String status,
            LocalDate fineDate) {

        this.referenceNumber = referenceNumber;
        this.violationName = violationName;
        this.amount = amount;
        this.status = status;
        this.fineDate = fineDate;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getViolationName() {
        return violationName;
    }

    public Double getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getFineDate() {
        return fineDate;
    }
}