package com.traffic.demo.dto;

import lombok.Data;

@Data
public class FineCategoryRequest {

    private String categoryCode;
    private String categoryName;
    private String description;
    private Double defaultAmount;
}