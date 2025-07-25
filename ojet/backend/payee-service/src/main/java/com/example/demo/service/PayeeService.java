package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Payee;
import com.example.demo.repository.PayeeRepository;

@Service
public class PayeeService {
    @Autowired
    private PayeeRepository repo;

    public List<Payee> getAll() { return repo.findAll(); }

    public Payee getById(Long id) { return repo.findById(id).orElse(null); }

    public Payee save(Payee p) { return repo.save(p); }

    public void delete(Long id) { repo.deleteById(id); }

    public List<Payee> getByAccNo(Long accNo) {
        return repo.findByAccNo(accNo);
    }
}
