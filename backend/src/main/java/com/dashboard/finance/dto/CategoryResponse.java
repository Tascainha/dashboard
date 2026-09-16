package com.dashboard.finance.dto;

import com.dashboard.finance.enums.TransactionType;

public record CategoryResponse(
        Long id,
        String name,
        TransactionType type,
        String color
) {
}
