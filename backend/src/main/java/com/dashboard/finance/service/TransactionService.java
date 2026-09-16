package com.dashboard.finance.service;

import com.dashboard.finance.dto.TransactionRequest;
import com.dashboard.finance.dto.TransactionResponse;
import com.dashboard.finance.entity.Account;
import com.dashboard.finance.entity.Category;
import com.dashboard.finance.entity.Transaction;
import com.dashboard.finance.exception.ResourceNotFoundException;
import com.dashboard.finance.repository.AccountRepository;
import com.dashboard.finance.repository.CategoryRepository;
import com.dashboard.finance.repository.TransactionRepository;
import com.dashboard.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request) {
        Account account = accountRepository.findByIdAndUserId(request.accountId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Transaction transaction = Transaction.builder()
                .user(userRepository.getReferenceById(userId))
                .account(account)
                .category(category)
                .description(request.description())
                .amount(request.amount())
                .type(request.type())
                .transactionDate(request.transactionDate())
                .build();
        transaction = transactionRepository.save(transaction);
        return toResponse(transaction);
    }

    public List<TransactionResponse> list(Long userId, LocalDate start, LocalDate end) {
        List<Transaction> transactions = (start != null && end != null)
                ? transactionRepository.findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, start, end)
                : transactionRepository.findAllByUserIdOrderByTransactionDateDesc(userId);
        return transactions.stream().map(this::toResponse).toList();
    }

    @Transactional
    public TransactionResponse update(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        Account account = accountRepository.findByIdAndUserId(request.accountId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setDescription(request.description());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setTransactionDate(request.transactionDate());

        transaction = transactionRepository.save(transaction);
        return toResponse(transaction);
    }

    @Transactional
    public void delete(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getAccount().getId(),
                t.getAccount().getName(),
                t.getCategory().getId(),
                t.getCategory().getName(),
                t.getCategory().getColor(),
                t.getDescription(),
                t.getAmount(),
                t.getType(),
                t.getTransactionDate());
    }
}
