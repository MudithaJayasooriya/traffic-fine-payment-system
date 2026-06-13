package com.traffic.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "fine")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String referenceNumber;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Long officerId;

    @Column(nullable = false)
    private Long driverId;

    @Column(nullable = false)
    private LocalDate fineDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private FineCategory category;

    public Long getId() {
        return id;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public Long getOfficerId() {
        return officerId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public LocalDate getFineDate() {
        return fineDate;
    }

    public FineCategory getCategory() {
        return category;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public void setFineDate(LocalDate fineDate) {
        this.fineDate = fineDate;
    }

    public void setCategory(FineCategory category) {
        this.category = category;
    }
}