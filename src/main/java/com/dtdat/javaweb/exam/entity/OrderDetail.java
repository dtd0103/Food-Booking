package com.dtdat.javaweb.exam.entity;

import lombok.Data;

@Data
public class OrderDetail {
	private int id;

	private int orderId;

	private int foodId;

	private int quantity;
	
	private Food food;
}
