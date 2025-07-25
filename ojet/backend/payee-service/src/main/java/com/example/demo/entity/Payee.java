package com.example.demo.entity;

import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PAYEE")
@Access(AccessType.FIELD)
public class Payee {
    @Id
    @Column(name = "PAYEEID")
    private Long payeeId;

    @Column(name = "ACCNO")
    private Long accNo;

    @Column(name = "PAYEENAME")
    private String payeeName;

    @Column(name = "PAYEEACCNO")
    private Long payeeAccNo;

	public Payee(Long payeeId, Long accNo, String payeeName, Long payeeAccNo) {
		super();
		this.payeeId = payeeId;
		this.accNo = accNo;
		this.payeeName = payeeName;
		this.payeeAccNo = payeeAccNo;
	}

	public Payee() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getPayeeId() {
		return payeeId;
	}

	public void setPayeeId(Long payeeId) {
		this.payeeId = payeeId;
	}

	public Long getAccNo() {
		return accNo;
	}

	public void setAccNo(Long accNo) {
		this.accNo = accNo;
	}

	public String getPayeeName() {
		return payeeName;
	}

	public void setPayeeName(String payeeName) {
		this.payeeName = payeeName;
	}

	public Long getPayeeAccNo() {
		return payeeAccNo;
	}

	public void setPayeeAccNo(Long payeeAccNo) {
		this.payeeAccNo = payeeAccNo;
	}
    
	
}