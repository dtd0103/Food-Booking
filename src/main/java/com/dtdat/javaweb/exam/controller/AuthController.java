package com.dtdat.javaweb.exam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dtdat.javaweb.exam.service.CustomAdminDetailsService;

@RestController
public class AuthController {
	@Autowired
	private CustomAdminDetailsService adminService;

//	@PostMapping("/admin/create")
//	public ResponseEntity<Admin> createAdmin(AdminCreateDTO request) {
//		Admin admin = adminService.createAdmin(request);
//		return ResponseEntity.status(201).body(admin);
//	}
}
