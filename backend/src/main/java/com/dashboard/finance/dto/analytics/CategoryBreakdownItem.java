package com.dashboard.finance.dto.analytics;

import java.math.BigDecimal;

public record CategoryBreakdownItem(
        Long categoryId,
        String categoryName,
        String color,
        BigDecimal total
) {
}
