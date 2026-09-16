package com.dashboard.finance.service;

import com.dashboard.finance.dto.analytics.DashboardSummaryResponse;
import com.dashboard.finance.dto.analytics.MonthlyTrendItem;
import com.dashboard.finance.enums.TransactionType;
import com.dashboard.finance.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private static final int TREND_MONTHS = 6;

    private final TransactionRepository transactionRepository;
    private final GoalService goalService;

    public DashboardSummaryResponse summary(Long userId, Integer year, Integer month) {
        YearMonth ym = (year != null && month != null) ? YearMonth.of(year, month) : YearMonth.now();
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal totalIncome = transactionRepository.sumByUserAndTypeAndDateRange(
                userId, TransactionType.INCOME, start, end);
        BigDecimal totalExpense = transactionRepository.sumByUserAndTypeAndDateRange(
                userId, TransactionType.EXPENSE, start, end);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        BigDecimal netWorth = transactionRepository.netAmountByUser(userId);

        var expenseByCategory = transactionRepository.breakdownByCategory(
                userId, TransactionType.EXPENSE, start, end);
        var incomeByCategory = transactionRepository.breakdownByCategory(
                userId, TransactionType.INCOME, start, end);

        YearMonth trendStart = ym.minusMonths(TREND_MONTHS - 1L);
        List<MonthlyTrendItem> trend = buildMonthlyTrend(userId, trendStart, ym);

        var goals = goalService.list(userId, ym.getYear(), ym.getMonthValue());

        return new DashboardSummaryResponse(
                ym.getYear(), ym.getMonthValue(),
                totalIncome, totalExpense, balance, netWorth,
                expenseByCategory, incomeByCategory, trend, goals);
    }

    private List<MonthlyTrendItem> buildMonthlyTrend(Long userId, YearMonth start, YearMonth end) {
        Map<YearMonth, BigDecimal[]> byMonth = new LinkedHashMap<>();
        for (YearMonth cursor = start; !cursor.isAfter(end); cursor = cursor.plusMonths(1)) {
            byMonth.put(cursor, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
        }

        for (Object[] row : transactionRepository.monthlyTrendRaw(userId, start.atDay(1), end.atEndOfMonth())) {
            YearMonth ym = YearMonth.of(((Number) row[0]).intValue(), ((Number) row[1]).intValue());
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            BigDecimal[] slot = byMonth.get(ym);
            if (slot == null) {
                continue;
            }
            if (type == TransactionType.INCOME) {
                slot[0] = slot[0].add(amount);
            } else {
                slot[1] = slot[1].add(amount);
            }
        }

        List<MonthlyTrendItem> result = new ArrayList<>();
        byMonth.forEach((ym, totals) ->
                result.add(new MonthlyTrendItem(ym.getYear(), ym.getMonthValue(), totals[0], totals[1])));
        return result;
    }
}
