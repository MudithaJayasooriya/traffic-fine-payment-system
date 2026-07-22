package com.traffic.demo.dto;

import java.time.LocalDate;

public class FineResponse {

    private Long id;
    private String referenceNumber;
    private String categoryCode;
    private String categoryName;
    private Double amount;
    private String status;
    private LocalDate fineDate;
    private Long officerId;
    private Long driverId;
    private String district;

    public FineResponse(
            Long id,
            String referenceNumber,
            String categoryCode,
            String categoryName,
            Double amount,
            String status,
            LocalDate fineDate,
            Long officerId,
            Long driverId,
            String district) {

        this.id=id;
        this.referenceNumber = referenceNumber;
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
        this.amount = amount;
        this.status = status;
        this.fineDate = fineDate;
        this.officerId = officerId;
        this.driverId = driverId;
        this.district = district;
    }

    public Long getId() {
        return id;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Double getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public String getDistrict() {
        return district;
    }

    public LocalDate getFineDate() {
        return fineDate;
    }

    public Long getOfficerId() {
        return officerId;
    }

    public Long getDriverId() {
        return driverId;
    }
}