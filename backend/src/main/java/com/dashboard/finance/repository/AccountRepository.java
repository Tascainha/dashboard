package com.dashboard.finance.repository;

import com.dashboard.finance.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByUserIdOrderByNameAsc(Long userId);
    Optional<Account> findByIdAndUserId(Long id, Long userId);
}
