package com.dtdat.javaweb.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtdat.javaweb.exam.entity.Ward;
import com.dtdat.javaweb.exam.service.WardService;

@RestController
@RequestMapping("/api/ward")
public class WardController {
	@Autowired
	private WardService wardService;

	@GetMapping("/city/{cityId}")
	public List<Ward> getWardByCityId(@PathVariable int cityId) {
		return wardService.getWardByCityId(cityId);
	}

	@GetMapping("/{id}")
	public Ward getWardById(@PathVariable int id) {
		return wardService.getWardById(id);
	}
}
