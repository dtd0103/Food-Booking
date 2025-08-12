package com.dtdat.javaweb.exam.repository.implement;

import org.springframework.beans.factory.annotation.Autowired;

import com.dtdat.javaweb.exam.entity.Admin;
import com.dtdat.javaweb.exam.mapper.AdminMapper;
import com.dtdat.javaweb.exam.repository.AdminRepository;

public class AdminRepositoryImpl implements AdminRepository {
	@Autowired
	AdminMapper adminMapper;

	public Admin findByUsername(String username) {
		return adminMapper.findByUsername(username);
	}
}
