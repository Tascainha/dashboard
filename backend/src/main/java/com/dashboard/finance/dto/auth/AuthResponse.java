package com.dashboard.finance.dto.auth;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email
) {
}
