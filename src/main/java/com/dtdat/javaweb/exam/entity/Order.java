package com.dtdat.javaweb.exam.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class Order {

	private int id;

	private String userName;

	private String phoneNumber;

	private int wardId;
	
	private Ward  ward;

	private String street;

	private String message;

	private BigDecimal total;

	private BigDecimal shippingFee;

	private LocalDateTime createdAt;

	private String state;
	
	private List<OrderDetail> items;
}
