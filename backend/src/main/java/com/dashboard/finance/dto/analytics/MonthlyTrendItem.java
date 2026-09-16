package com.dashboard.finance.dto.analytics;

import java.math.BigDecimal;

public record MonthlyTrendItem(
        int year,
        int month,
        BigDecimal income,
        BigDecimal expense
) {
}
