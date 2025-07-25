package com.example.demo.service;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepo;

    @Override
    public Customer addCustomer(Customer customer) {
        Optional<Customer> existing = customerRepo.findById(customer.getAadhaar());
        if (existing.isEmpty()) {
            return customerRepo.save(customer);
        }
        return customer;
    }

    @Override
    public Customer getCustomerById(String aadhaar) {
        return customerRepo.findById(aadhaar).orElse(null);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    @Override
    public void deleteCustomer(String aadhaar) {
        Optional<Customer> existing = customerRepo.findById(aadhaar);
        if (existing.isPresent()) {
            customerRepo.deleteById(aadhaar);
        }
    }

	@Override
	public Customer updateCustomer(String aadhaar, Customer updatedCustomer) {
		 Customer existingCustomer = customerRepo.findById(aadhaar)
			        .orElseThrow(() -> new RuntimeException("Customer not found with Aadhaar: " + aadhaar));

			    // Update fields
			    existingCustomer.setCustomerName(updatedCustomer.getCustomerName());
			    existingCustomer.setAddress(updatedCustomer.getAddress());
			    existingCustomer.setMobile(updatedCustomer.getMobile());
			    existingCustomer.setEmail(updatedCustomer.getEmail());
			    existingCustomer.setDob(updatedCustomer.getDob());
			    existingCustomer.setGender(updatedCustomer.getGender());
			    existingCustomer.setMaritalStatus(updatedCustomer.getMaritalStatus());
			    existingCustomer.setOccupation(updatedCustomer.getOccupation());
			    existingCustomer.setPan(updatedCustomer.getPan());

			    return customerRepo.save(existingCustomer);
			}
}





