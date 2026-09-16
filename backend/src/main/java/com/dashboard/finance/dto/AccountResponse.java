package com.dashboard.finance.dto;

import com.dashboard.finance.enums.AccountType;

import java.math.BigDecimal;

public record AccountResponse(
        Long id,
        String name,
        AccountType type,
        BigDecimal initialBalance,
        BigDecimal currentBalance
) {
}
