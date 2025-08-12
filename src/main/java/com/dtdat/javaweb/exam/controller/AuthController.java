package com.dtdat.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtdat.javaweb.exam.dto.ChangePasswordDTO;

import com.dtdat.javaweb.exam.secure.CustomAdminDetails;
import com.dtdat.javaweb.exam.service.CustomAdminDetailsService;

@RestController
@RequestMapping("/admin")
public class AuthController {

	@Autowired
	private CustomAdminDetailsService adminDetailsService;

	@PostMapping("/change-password")
	public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDTO request) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
		}

		String username = ((CustomAdminDetails) authentication.getPrincipal()).getUsername();

		boolean passwordChanged = adminDetailsService.changePassword(username, request.getCurrentPassword(),
				request.getNewPassword());

		if (passwordChanged) {
			adminDetailsService.reauthenticateUser(username, request.getNewPassword());
			return new ResponseEntity<>("Password changed successfully and re-authenticated", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Failed to change password. Check current password.", HttpStatus.BAD_REQUEST);
		}
	}
}