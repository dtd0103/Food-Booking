package com.dtdat.javaweb.exam.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FoodCreateDTO {
	private int id;

	@NotBlank(message = "Food type cannot be empty")
	@Size(max = 50, message = "Food type must be less than or equal to 50 characters")
	private String type;

	@NotBlank(message = "Food name cannot be empty")
	@Size(max = 100, message = "Food name must be less than or equal to 100 characters")
	private String name;

	@Size(max = 500, message = "Description must be less than or equal to 500 characters")
	private String description;

	@NotNull(message = "Price cannot be null")
	@DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
	@Digits(integer = 10, fraction = 2, message = "Digits of price must be less than or equal 10 in length, decimal digits must be less than or equal 2 in length")
	private BigDecimal price;

	private boolean status;
}
