package com.dtdat.javaweb.exam.repository;

import com.dtdat.javaweb.exam.entity.Admin;

public interface AdminRepository {
	public Admin findByUsername(String username);

	public void insertAdmin(Admin admin);
}
