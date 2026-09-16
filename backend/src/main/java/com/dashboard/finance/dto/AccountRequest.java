package com.dashboard.finance.dto;

import com.dashboard.finance.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AccountRequest(
        @NotBlank String name,
        @NotNull AccountType type,
        @NotNull BigDecimal initialBalance
) {
}
