package com.dashboard.finance.dto;

import com.dashboard.finance.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CategoryRequest(
        @NotBlank String name,
        @NotNull TransactionType type,
        @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "color must be a hex value like #22C55E") String color
) {
}
