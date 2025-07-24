package com.example.demo;

import com.example.demo.entity.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
public class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    public void testFetchTransactionById() {
        String transactionId = "T001";

        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);

        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            System.out.println("TransactionID: " + transaction.getTransactionID());
            System.out.println("Account No: " + transaction.getAccNo());
            System.out.println("Transaction Date: " + transaction.getTransDate());
            System.out.println("Amount: " + transaction.getTransAmount());
            System.out.println("Type: " + transaction.getTransType());
            System.out.println("Remaining Balance: " + transaction.getRemBalance());
            System.out.println("Mode: " + transaction.getTransactionMode());
            System.out.println("Destination Account: " + transaction.getDestAccNo());
        } else {
            System.out.println("Transaction not found for ID: " + transactionId);
        }
    }
}
