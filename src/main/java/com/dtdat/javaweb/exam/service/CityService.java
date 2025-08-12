package com.dtdat.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dtdat.javaweb.exam.entity.City;
import com.dtdat.javaweb.exam.repository.CityRepository;

@Service
public class CityService {
	@Autowired
	private CityRepository cityRepository;

	public List<City> getAllCity() {
		return cityRepository.getAll();
	}
}
