package com.dashboard.finance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Monthly spending limit ("budget") for a category.
 */
@Entity
@Table(name = "goals", uniqueConstraints = @UniqueConstraint(columnNames = {"category_id", "ref_year", "ref_month"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "target_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "ref_year", nullable = false)
    private Integer refYear;

    @Column(name = "ref_month", nullable = false)
    private Integer refMonth;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
