package com.dtdat.javaweb.exam.repository.implement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.dtdat.javaweb.exam.entity.City;
import com.dtdat.javaweb.exam.mapper.CityMapper;
import com.dtdat.javaweb.exam.repository.CityRepository;

@Repository
public class CityRepositoryImpl implements CityRepository {
	@Autowired
	private CityMapper cityMapper;

	public List<City> getAll() {
		return cityMapper.getAll();
	}
}
