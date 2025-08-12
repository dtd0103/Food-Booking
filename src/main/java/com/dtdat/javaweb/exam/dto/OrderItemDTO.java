package com.dtdat.javaweb.exam.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class OrderItemDTO {
	private int foodId;

	@Min(value = 1, message = "Quantity must be a positive integer")
	private int quantity;
}