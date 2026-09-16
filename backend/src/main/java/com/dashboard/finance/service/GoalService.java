package com.dashboard.finance.service;

import com.dashboard.finance.dto.GoalRequest;
import com.dashboard.finance.dto.GoalResponse;
import com.dashboard.finance.entity.Category;
import com.dashboard.finance.entity.Goal;
import com.dashboard.finance.enums.TransactionType;
import com.dashboard.finance.exception.BadRequestException;
import com.dashboard.finance.exception.ResourceNotFoundException;
import com.dashboard.finance.repository.CategoryRepository;
import com.dashboard.finance.repository.GoalRepository;
import com.dashboard.finance.repository.TransactionRepository;
import com.dashboard.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoalService {

    private final GoalRepository goalRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public GoalResponse create(Long userId, GoalRequest request) {
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (goalRepository.existsByUserIdAndCategoryIdAndRefYearAndRefMonth(
                userId, request.categoryId(), request.refYear(), request.refMonth())) {
            throw new BadRequestException("A goal already exists for this category and month");
        }

        Goal goal = Goal.builder()
                .user(userRepository.getReferenceById(userId))
                .category(category)
                .targetAmount(request.targetAmount())
                .refYear(request.refYear())
                .refMonth(request.refMonth())
                .build();
        goal = goalRepository.save(goal);
        return toResponse(goal);
    }

    public List<GoalResponse> list(Long userId, Integer year, Integer month) {
        int refYear = year != null ? year : YearMonth.now().getYear();
        int refMonth = month != null ? month : YearMonth.now().getMonthValue();
        return goalRepository.findAllByUserIdAndRefYearAndRefMonth(userId, refYear, refMonth).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GoalResponse update(Long userId, Long goalId, GoalRequest request) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        goal.setCategory(category);
        goal.setTargetAmount(request.targetAmount());
        goal.setRefYear(request.refYear());
        goal.setRefMonth(request.refMonth());
        goal = goalRepository.save(goal);
        return toResponse(goal);
    }

    @Transactional
    public void delete(Long userId, Long goalId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        goalRepository.delete(goal);
    }

    private GoalResponse toResponse(Goal goal) {
        YearMonth ym = YearMonth.of(goal.getRefYear(), goal.getRefMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal spent = transactionRepository.breakdownByCategory(
                        goal.getUser().getId(), TransactionType.EXPENSE, start, end)
                .stream()
                .filter(item -> item.categoryId().equals(goal.getCategory().getId()))
                .map(item -> item.total())
                .findFirst()
                .orElse(BigDecimal.ZERO);

        double progress = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        return new GoalResponse(
                goal.getId(),
                goal.getCategory().getId(),
                goal.getCategory().getName(),
                goal.getCategory().getColor(),
                goal.getTargetAmount(),
                goal.getRefYear(),
                goal.getRefMonth(),
                spent,
                Math.round(progress * 10) / 10.0);
    }
}
