package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.LoginAttempt;
import com.example.demo.repository.LoginAttemptRepository;

@Service
public class LoginAttemptService {

    @Autowired
    private LoginAttemptRepository repository;

    public LoginAttempt save(LoginAttempt attempt) {
        return repository.save(attempt);
    }

    public List<LoginAttempt> getAll() {
        return repository.findAll();
    }

    public LoginAttempt getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<LoginAttempt> getByAadhaar(String aadhaar) {
        return repository.findByAadhaar(aadhaar);
    }
}