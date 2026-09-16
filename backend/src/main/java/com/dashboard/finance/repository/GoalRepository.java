package com.dashboard.finance.repository;

import com.dashboard.finance.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findAllByUserIdAndRefYearAndRefMonth(Long userId, Integer refYear, Integer refMonth);
    Optional<Goal> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndCategoryIdAndRefYearAndRefMonth(Long userId, Long categoryId, Integer refYear, Integer refMonth);
}
