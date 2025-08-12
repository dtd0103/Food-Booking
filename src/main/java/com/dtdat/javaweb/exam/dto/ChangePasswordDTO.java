package com.dtdat.javaweb.exam.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {
	private String currentPassword;
	private String newPassword;
}