package com.dtdat.javaweb.exam.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.dtdat.javaweb.exam.entity.Admin;

@Mapper
public interface AdminMapper {
	Admin findByUsername(String username);

	void updatePassword(String username, String newPassword);
}