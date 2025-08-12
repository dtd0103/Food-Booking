package com.dtdat.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.dtdat.javaweb.exam.entity.Ward;

@Mapper
public interface WardMapper {
	List<Ward> getByCityId(int cityId);

	Ward getById(int id);
}
