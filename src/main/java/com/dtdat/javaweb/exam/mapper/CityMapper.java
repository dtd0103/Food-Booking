package com.dtdat.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.dtdat.javaweb.exam.entity.City;

@Mapper
public interface CityMapper {
	List<City> getAll();
}
