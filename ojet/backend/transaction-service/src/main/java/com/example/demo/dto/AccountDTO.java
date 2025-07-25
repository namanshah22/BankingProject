package com.example.demo.dto;


public class AccountDTO {
    private Long accountNo;
    private String accStatus;
    private Double openingBalance;
    private String branch;
    private String changeInAccDetails;

    public AccountDTO() {}

    public AccountDTO(Long accountNo, String accStatus, Double openingBalance, String branch, String changeInAccDetails) {
        this.accountNo = accountNo;
        this.accStatus = accStatus;
        this.openingBalance = openingBalance;
        this.branch = branch;
        this.changeInAccDetails = changeInAccDetails;
    }

	public Long getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(Long accountNo) {
		this.accountNo = accountNo;
	}

	public String getAccStatus() {
		return accStatus;
	}

	public void setAccStatus(String accStatus) {
		this.accStatus = accStatus;
	}

	public Double getOpeningBalance() {
		return openingBalance;
	}

	public void setOpeningBalance(Double openingBalance) {
		this.openingBalance = openingBalance;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getChangeInAccDetails() {
		return changeInAccDetails;
	}

	public void setChangeInAccDetails(String changeInAccDetails) {
		this.changeInAccDetails = changeInAccDetails;
	}

    // Getters and Setters
}

