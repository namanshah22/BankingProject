package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class PayeeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PayeeServiceApplication.class, args);
		System.out.println("This is Payee");
	}

}
