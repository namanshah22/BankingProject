package com.example.demo.service;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.vo.LoginAttempt;

@FeignClient(name = "loginattempt-service")
public interface LoginAttemptClient {
    @GetMapping("/login-attempts/aadhaar/{aadhaar}")
    List<LoginAttempt> findByAadhaar(@PathVariable String aadhaar);
}