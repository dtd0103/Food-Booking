package com.dtdat.javaweb.exam.repository.implement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.dtdat.javaweb.exam.entity.Ward;
import com.dtdat.javaweb.exam.mapper.WardMapper;
import com.dtdat.javaweb.exam.repository.WardRepository;

@Repository
public class WardRepositoryImpl implements WardRepository {
	@Autowired
	private WardMapper wardMapper;

	public List<Ward> getByCityId(int cityId) {
		return wardMapper.getByCityId(cityId);
	}

	public Ward getById(int id) {
		return wardMapper.getById(id);
	}
}
