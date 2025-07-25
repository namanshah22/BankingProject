package com.example.demo.vo;

public class LoginAttempt {
    private Long recordId;
    private String aadhaar;
    private Integer loginAttempts;
	
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