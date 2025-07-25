package com.example.demo.entity;

import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ACCOUNT")
@Access(AccessType.FIELD)
public class Account {

    @Id
    @Column(name = "ACCOUNTNO")
    private Long accountNo;

    @Column(name = "AADHAAR")
    private String aadhaar;

    @Column(name = "ACCSTATUS")
    private String accStatus;

    @Column(name = "OPENINGBALANCE")
    private Double openingBalance;

    @Column(name = "BRANCH")
    private String branch;

    @Column(name = "CHANGEINACCDETAILS")
    private String changeInAccDetails;

    public Account() {}

    public Account(Long accountNo, String aadhaar, String accStatus, Double openingBalance, String branch, String changeInAccDetails) {
        this.accountNo = accountNo;
        this.aadhaar = aadhaar;
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

    public String getAadhaar() {
        return aadhaar;
    }

    public void setAadhaar(String aadhaar) {
        this.aadhaar = aadhaar;
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
}
