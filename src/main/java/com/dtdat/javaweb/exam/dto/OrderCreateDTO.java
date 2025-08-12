package com.dtdat.javaweb.exam.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class OrderCreateDTO {
	private int id;

	private String userName;
	private String phoneNumber;
	private String street;

	private int wardId;

	private String message;

	private BigDecimal total;
	private BigDecimal shippingFee;

	private List<OrderItemDTO> items;
}
