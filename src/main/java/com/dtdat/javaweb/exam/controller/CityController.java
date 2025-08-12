package com.dtdat.javaweb.exam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtdat.javaweb.exam.entity.City;
import com.dtdat.javaweb.exam.service.CityService;

@RestController
@RequestMapping("/api/city")
public class CityController {
	@Autowired
	private CityService cityService;

	@GetMapping
	public List<City> getAllCity() {
		return cityService.getAllCity();
	}
}
