package com.example.demo.client;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.dto.AccountDTO;

@FeignClient(name = "account-service")
public interface AccountClient {

    @GetMapping("/account/{accountNo}")
    AccountDTO getAccountByAccountNo(@PathVariable("accountNo") Long accountNo);
}

