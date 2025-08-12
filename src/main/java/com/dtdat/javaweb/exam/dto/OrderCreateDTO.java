package com.dtdat.javaweb.exam.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderCreateDTO {
	private int id;

	@NotBlank(message = "User name cannot be empty")
	@Size(max = 100, message = "User name must be less than or equal to 100 characters")
	private String userName;

	@NotBlank(message = "Phone number cannot be empty")
	@Pattern(regexp = "^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?\\d{3}(\\s|\\.)?\\d{3}$", message = "Invalid phone number format")
	private String phoneNumber;

	@NotBlank(message = "Street cannot be empty")
	@Size(max = 255, message = "Street must be less than or equal to 255 characters")
	private String street;

	@Min(value = 1, message = "Ward ID must be a positive integer")
	private int wardId;

	@Size(max = 500, message = "Message must be less than or equal to 500 characters")
	private String message;

	@NotNull(message = "Total cannot be null")
	@DecimalMin(value = "0.0", inclusive = true, message = "Total must be non-negative")
	private BigDecimal total;

	@NotNull(message = "Shipping fee cannot be null")
	@DecimalMin(value = "0.0", inclusive = true, message = "Shipping fee must be non-negative")
	private BigDecimal shippingFee;

	@NotNull(message = "Order items cannot be null")
	@NotEmpty(message = "Order must contain at least one item")
	private List<OrderItemDTO> items;
}
