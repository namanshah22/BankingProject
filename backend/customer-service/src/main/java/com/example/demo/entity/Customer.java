package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Customer {

    @Id
    @Column(length = 12)
    private String aadhaar;

    @Column(name = "CUSTOMERNAME")
    private String customerName;
    private String address;

    @Column(length = 10)
    private String mobile;

    private String email;

    @Temporal(TemporalType.DATE)
    private Date dob;

    private String gender;
    @Column(name = "MARITALSTATUS")
    private String maritalStatus;
    private String occupation;

    @Column(length = 10)
    private String pan;

    @Column(name = "PASSWORD")
    private String password; // Add getter/setter

	public String getAadhaar() {
		return aadhaar;
	}

	public void setAadhaar(String aadhaar) {
		this.aadhaar = aadhaar;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getPan() {
		return pan;
	}

	public void setPan(String pan) {
		this.pan = pan;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Customer(String aadhaar, String customerName, String address, String mobile, String email, Date dob,
			String gender, String maritalStatus, String occupation, String pan) {
		super();
		this.aadhaar = aadhaar;
		this.customerName = customerName;
		this.address = address;
		this.mobile = mobile;
		this.email = email;
		this.dob = dob;
		this.gender = gender;
		this.maritalStatus = maritalStatus;
		this.occupation = occupation;
		this.pan = pan;
	}

	public Customer() {
		super();
		// TODO Auto-generated constructor stub
	}

}

