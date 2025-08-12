package com.dtdat.javaweb.exam.dto;

import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
	private int orderId;
	private String newState;
}