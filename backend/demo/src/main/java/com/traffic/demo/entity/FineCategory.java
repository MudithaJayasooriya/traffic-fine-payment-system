package com.traffic.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fine_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FineCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String categoryCode;

    @Column(nullable = false)
    private String categoryName;

    private String description;

    @Column(nullable = false)
    private Double defaultAmount;

    private Boolean active = true;
}