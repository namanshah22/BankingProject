package com.example.demo.service;

import com.example.demo.entity.Customer;
import java.util.List;

public interface CustomerService {
    Customer addCustomer(Customer customer);
    Customer getCustomerById(String aadhaar);
    List<Customer> getAllCustomers();
    void deleteCustomer(String aadhaar);
    Customer updateCustomer(String aadhaar, Customer updatedCustomer);

}
