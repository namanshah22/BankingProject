package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "LOGIN_ATTEMPT")
public class LoginAttempt {

    @Id
    @Column(name = "RECORDID")
    private Long recordId;

    @Column(name = "AADHAAR")
    private String aadhaar;

    @Column(name = "LOGINATTEMPTS")
    private Integer loginAttempts;

	public Long getRecordId() {
		return recordId;
	}

	public void setRecordId(Long recordId) {
		this.recordId = recordId;
	}

	public String getAadhaar() {
		return aadhaar;
	}

	public void setAadhaar(String aadhaar) {
		this.aadhaar = aadhaar;
	}

	public Integer getLoginAttempts() {
		return loginAttempts;
	}

	public void setLoginAttempts(Integer loginAttempts) {
		this.loginAttempts = loginAttempts;
	}

	public LoginAttempt(Long recordId, String aadhaar, Integer loginAttempts) {
		super();
		this.recordId = recordId;
		this.aadhaar = aadhaar;
		this.loginAttempts = loginAttempts;
	}

	public LoginAttempt() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}