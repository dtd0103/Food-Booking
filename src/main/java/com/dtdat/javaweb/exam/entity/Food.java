package com.dtdat.javaweb.exam.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Food {
	private int id;

	private String type;

	private String image;

	private String name;

	private String description;

	private BigDecimal price;

	private boolean status;
}
