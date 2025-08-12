package com.dtdat.javaweb.exam.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Ward {
	private int id;

	private String name;

	private int cityId;
	
	private City city;

	private BigDecimal shippingFee;
}
