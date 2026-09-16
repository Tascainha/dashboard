package com.dashboard.finance.dto.analytics;

import com.dashboard.finance.dto.GoalResponse;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        int year,
        int month,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        BigDecimal netWorth,
        List<CategoryBreakdownItem> expenseByCategory,
        List<CategoryBreakdownItem> incomeByCategory,
        List<MonthlyTrendItem> monthlyTrend,
        List<GoalResponse> goals
) {
}
