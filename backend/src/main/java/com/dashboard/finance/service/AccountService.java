package com.dashboard.finance.service;

import com.dashboard.finance.dto.AccountRequest;
import com.dashboard.finance.dto.AccountResponse;
import com.dashboard.finance.entity.Account;
import com.dashboard.finance.exception.ResourceNotFoundException;
import com.dashboard.finance.repository.AccountRepository;
import com.dashboard.finance.repository.TransactionRepository;
import com.dashboard.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public AccountResponse create(Long userId, AccountRequest request) {
        Account account = Account.builder()
                .user(userRepository.getReferenceById(userId))
                .name(request.name())
                .type(request.type())
                .initialBalance(request.initialBalance())
                .build();
        account = accountRepository.save(account);
        return toResponse(account, account.getInitialBalance());
    }

    public List<AccountResponse> list(Long userId) {
        return accountRepository.findAllByUserIdOrderByNameAsc(userId).stream()
                .map(a -> toResponse(a, currentBalance(a)))
                .toList();
    }

    public AccountResponse get(Long userId, Long accountId) {
        Account account = findOwned(userId, accountId);
        return toResponse(account, currentBalance(account));
    }

    @Transactional
    public AccountResponse update(Long userId, Long accountId, AccountRequest request) {
        Account account = findOwned(userId, accountId);
        account.setName(request.name());
        account.setType(request.type());
        account.setInitialBalance(request.initialBalance());
        account = accountRepository.save(account);
        return toResponse(account, currentBalance(account));
    }

    @Transactional
    public void delete(Long userId, Long accountId) {
        Account account = findOwned(userId, accountId);
        accountRepository.delete(account);
    }

    private Account findOwned(Long userId, Long accountId) {
        return accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }

    private BigDecimal currentBalance(Account account) {
        BigDecimal net = transactionRepository.netAmountByAccount(account.getUser().getId(), account.getId());
        return account.getInitialBalance().add(net);
    }

    private AccountResponse toResponse(Account account, BigDecimal currentBalance) {
        return new AccountResponse(
                account.getId(),
                account.getName(),
                account.getType(),
                account.getInitialBalance(),
                currentBalance);
    }
}
