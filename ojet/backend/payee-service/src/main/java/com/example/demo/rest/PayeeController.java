package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Payee;
import com.example.demo.service.PayeeService;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/payees")
public class PayeeController {
    @Autowired
    private PayeeService service;

    @GetMapping
    public List<Payee> all() { return service.getAll(); }

    @GetMapping("/{id}")
    public Payee one(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/account/{accNo}")
    public List<Payee> byAccount(@PathVariable Long accNo) {
        return service.getByAccNo(accNo);
    }

    @PostMapping
    public Payee create(@RequestBody Payee payee) { return service.save(payee); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}