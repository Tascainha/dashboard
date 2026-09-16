package com.dashboard.finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record GoalRequest(
        @NotNull Long categoryId,
        @NotNull @DecimalMin(value = "0.01") BigDecimal targetAmount,
        @NotNull @Min(2000) @Max(2100) Integer refYear,
        @NotNull @Min(1) @Max(12) Integer refMonth
) {
}
