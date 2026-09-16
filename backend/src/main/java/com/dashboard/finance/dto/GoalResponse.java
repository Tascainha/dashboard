package com.dashboard.finance.dto;

import java.math.BigDecimal;

public record GoalResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String categoryColor,
        BigDecimal targetAmount,
        Integer refYear,
        Integer refMonth,
        BigDecimal spentAmount,
        double progressPercent
) {
}
