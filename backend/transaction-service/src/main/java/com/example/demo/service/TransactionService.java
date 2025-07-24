package com.example.demo.service;




import java.util.List;

import com.example.demo.entity.Transaction;

public interface TransactionService {
    Transaction createTransaction(Transaction transaction);
    List<Transaction> getAllTransactions();
    Transaction getTransactionById(String id);
}
