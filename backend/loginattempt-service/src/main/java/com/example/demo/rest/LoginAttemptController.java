package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.LoginAttempt;
import com.example.demo.service.LoginAttemptService;

@RestController
@RequestMapping("/login-attempts")
public class LoginAttemptController {

    @Autowired
    private LoginAttemptService service;

    @PostMapping
    public LoginAttempt addAttempt(@RequestBody LoginAttempt attempt) {
        return service.save(attempt);
    }

    @GetMapping
    public List<LoginAttempt> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public LoginAttempt getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/aadhaar/{aadhaar}")
    public List<LoginAttempt> getByAadhaar(@PathVariable String aadhaar) {
        return service.getByAadhaar(aadhaar);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}