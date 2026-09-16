package com.dashboard.finance.dto;

import com.dashboard.finance.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        Long accountId,
        String accountName,
        Long categoryId,
        String categoryName,
        String categoryColor,
        String description,
        BigDecimal amount,
        TransactionType type,
        LocalDate transactionDate
) {
}
