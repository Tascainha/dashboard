package com.dashboard.finance.repository;

import com.dashboard.finance.dto.analytics.CategoryBreakdownItem;
import com.dashboard.finance.entity.Transaction;
import com.dashboard.finance.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    List<Transaction> findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId, LocalDate start, LocalDate end);

    List<Transaction> findAllByUserIdOrderByTransactionDateDesc(Long userId);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from Transaction t
            where t.user.id = :userId and t.type = :type
              and t.transactionDate between :start and :end
            """)
    BigDecimal sumByUserAndTypeAndDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("""
            select new com.dashboard.finance.dto.analytics.CategoryBreakdownItem(
                c.id, c.name, c.color, coalesce(sum(t.amount), 0))
            from Transaction t join t.category c
            where t.user.id = :userId and t.type = :type
              and t.transactionDate between :start and :end
            group by c.id, c.name, c.color
            order by sum(t.amount) desc
            """)
    List<CategoryBreakdownItem> breakdownByCategory(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("""
            select function('year', t.transactionDate), function('month', t.transactionDate),
                t.type, coalesce(sum(t.amount), 0)
            from Transaction t
            where t.user.id = :userId and t.transactionDate between :start and :end
            group by function('year', t.transactionDate), function('month', t.transactionDate), t.type
            """)
    List<Object[]> monthlyTrendRaw(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("""
            select coalesce(sum(case when t.type = 'INCOME' then t.amount else -t.amount end), 0)
            from Transaction t
            where t.user.id = :userId and t.account.id = :accountId
            """)
    BigDecimal netAmountByAccount(@Param("userId") Long userId, @Param("accountId") Long accountId);

    @Query("""
            select coalesce(sum(case when t.type = 'INCOME' then t.amount else -t.amount end), 0)
            from Transaction t
            where t.user.id = :userId
            """)
    BigDecimal netAmountByUser(@Param("userId") Long userId);
}
