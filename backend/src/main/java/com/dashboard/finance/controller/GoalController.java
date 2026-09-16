package com.dashboard.finance.controller;

import com.dashboard.finance.dto.GoalRequest;
import com.dashboard.finance.dto.GoalResponse;
import com.dashboard.finance.security.UserPrincipal;
import com.dashboard.finance.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(principal.getId(), request));
    }

    @GetMapping
    public List<GoalResponse> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        return goalService.list(principal.getId(), year, month);
    }

    @PutMapping("/{id}")
    public GoalResponse update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {
        return goalService.update(principal.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        goalService.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
