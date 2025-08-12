package com.dtdat.javaweb.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dtdat.javaweb.exam.entity.Ward;
import com.dtdat.javaweb.exam.repository.WardRepository;

@Service
public class WardService {
	@Autowired
	private WardRepository wardRepository;

	public List<Ward> getWardByCityId(int cityId) {
		return wardRepository.getByCityId(cityId);
	}

	public Ward getWardById(int id) {
		return wardRepository.getById(id);
	}
	
}
