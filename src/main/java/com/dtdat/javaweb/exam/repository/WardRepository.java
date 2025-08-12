package com.dtdat.javaweb.exam.repository;

import java.util.List;

import com.dtdat.javaweb.exam.entity.Ward;

public interface WardRepository {
	public List<Ward> getByCityId(int cityId);

	public Ward getById(int id);
}
