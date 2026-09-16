package com.dashboard.finance.controller;

import com.dashboard.finance.dto.AccountRequest;
import com.dashboard.finance.dto.AccountResponse;
import com.dashboard.finance.security.UserPrincipal;
import com.dashboard.finance.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.create(principal.getId(), request));
    }

    @GetMapping
    public List<AccountResponse> list(@AuthenticationPrincipal UserPrincipal principal) {
        return accountService.list(principal.getId());
    }

    @GetMapping("/{id}")
    public AccountResponse get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return accountService.get(principal.getId(), id);
    }

    @PutMapping("/{id}")
    public AccountResponse update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody AccountRequest request) {
        return accountService.update(principal.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        accountService.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
