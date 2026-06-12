package com.traffic.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fine")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_number", unique = true, nullable = false)
    private String referenceNumber;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String status;

    @Column(name = "officer_id", nullable = false)
    private Long officerId;

    @Column(name = "fine_date")
    private LocalDate fineDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Fine() {
    }

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

    public LocalDate getFineDate() {
        return fineDate;
    }

    public Category getCategory() {
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

    public void setFineDate(LocalDate fineDate) {
        this.fineDate = fineDate;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}