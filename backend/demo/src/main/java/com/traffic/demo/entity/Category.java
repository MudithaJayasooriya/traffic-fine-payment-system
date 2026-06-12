package com.traffic.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_code", nullable = false, unique = true)
    private String categoryCode;

    @Column(name = "violation_name", nullable = false)
    private String violationName;

    @Column(name = "fine_amount", nullable = false)
    private Double fineAmount;

    public Category() {
    }

    public Long getId() {
        return id;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public String getViolationName() {
        return violationName;
    }

    public Double getFineAmount() {
        return fineAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public void setViolationName(String violationName) {
        this.violationName = violationName;
    }

    public void setFineAmount(Double fineAmount) {
        this.fineAmount = fineAmount;
    }
}