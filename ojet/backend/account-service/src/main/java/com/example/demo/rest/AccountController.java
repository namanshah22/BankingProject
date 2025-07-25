package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Account;
import com.example.demo.service.AccountService;


@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService service;

    @GetMapping
    public List<Account> all() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Account one(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/aadhaar/{aadhaar}")
    public List<Account> byAadhaar(@PathVariable String aadhaar) {
        return service.getByAadhaar(aadhaar);
    }

    @PostMapping
    public Account create(@RequestBody Account account) {
        return service.create(account);
    }

    @PutMapping("/{id}")
    public Account update(@PathVariable Long id, @RequestBody Account account) {
        return service.update(id, account);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}