package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;



@Entity
@Table(name = "TRANSACTION")
public class Transaction {

    @Id
    @Column(name = "TRANSACTIONID")
    private String transactionId;

    @Column(name = "ACCNO")
    private Long accNo;

    @Column(name = "TRANSDATE")
    @Temporal(TemporalType.DATE)
    private Date transDate;

    @Column(name = "TRANSAMOUNT")
    private Double transAmount;

    @Column(name = "TRANSTYPE")
    private String transType;

    @Column(name = "REMBALANCE")
    private Double remBalance;

    @Column(name = "TRANSACTIONMODE")
    private String transactionMode;
    
    @Column(name = "DESTACCNO")
    private Long destAccNo;

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public Long getAccNo() {
		return accNo;
	}

	public void setAccNo(Long accNo) {
		this.accNo = accNo;
	}

	public Date getTransDate() {
		return transDate;
	}

	public void setTransDate(Date transDate) {
		this.transDate = transDate;
	}

	public Double getTransAmount() {
		return transAmount;
	}

	public void setTransAmount(Double transAmount) {
		this.transAmount = transAmount;
	}

	public String getTransType() {
		return transType;
	}

	public void setTransType(String transType) {
		this.transType = transType;
	}

	public Double getRemBalance() {
		return remBalance;
	}

	public void setRemBalance(Double remBalance) {
		this.remBalance = remBalance;
	}

	public String getTransactionMode() {
		return transactionMode;
	}

	public void setTransactionMode(String transactionMode) {
		this.transactionMode = transactionMode;
	}

	public Long getDestAccNo() {
		return destAccNo;
	}

	public void setDestAccNo(Long destAccNo) {
		this.destAccNo = destAccNo;
	}

	public Transaction(String transactionId, Long accNo, Date transDate, Double transAmount, String transType,
			Double remBalance, String transactionMode, Long destAccNo) {
		super();
		this.transactionId = transactionId;
		this.accNo = accNo;
		this.transDate = transDate;
		this.transAmount = transAmount;
		this.transType = transType;
		this.remBalance = remBalance;
		this.transactionMode = transactionMode;
		this.destAccNo = destAccNo;
	}

	public Transaction() {
		super();
		// TODO Auto-generated constructor stub
	}

    
}
