package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.service.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Add a new customer
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);
    }

    // Get a customer by Aadhaar ID
    @GetMapping("/{aadhaar}")
    public Customer getCustomerById(@PathVariable String aadhaar) {
        return customerService.getCustomerById(aadhaar);
    }

    // Get all customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // Delete a customer by Aadhaar ID
    @DeleteMapping("/{aadhaar}")
    public void deleteCustomer(@PathVariable String aadhaar) {
        customerService.deleteCustomer(aadhaar);
    }
    
    // Update an existing customer by Aadhaar ID
    @PutMapping("/{aadhaar}")
    public Customer updateCustomer(@PathVariable String aadhaar, @RequestBody Customer updatedCustomer) {
        return customerService.updateCustomer(aadhaar, updatedCustomer);
    }

    @PostMapping("/login")
    public ResponseEntity<Customer> login(@RequestBody Map<String, String> loginData) {
        String aadhaar = loginData.get("aadhaar");
        String password = loginData.get("password");
        Customer customer = customerService.getCustomerById(aadhaar);
        if (customer != null && customer.getPassword().equals(password)) {
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
