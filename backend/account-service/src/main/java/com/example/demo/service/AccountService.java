package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Account;
import com.example.demo.repository.AccountRepository;

@Service
public class AccountService {

    private final AccountRepository repository;

    public AccountService(AccountRepository repository) {
        this.repository = repository;
    }

    public List<Account> getAll() {
        return repository.findAll();
    }

    public Account getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Account> getByAadhaar(String aadhaar) {
        return repository.findByAadhaar(aadhaar);
    }

    public Account create(Account account) {
        return repository.save(account);
    }

    public Account update(Long id, Account updatedAccount) {
        Optional<Account> optional = repository.findById(id);
        if (optional.isPresent()) {
            Account existing = optional.get();
            existing.setAadhaar(updatedAccount.getAadhaar());
            existing.setAccStatus(updatedAccount.getAccStatus());
            existing.setOpeningBalance(updatedAccount.getOpeningBalance());
            existing.setBranch(updatedAccount.getBranch());
            existing.setChangeInAccDetails(updatedAccount.getChangeInAccDetails());
            return repository.save(existing);
        } else {
            return null;
        }
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}