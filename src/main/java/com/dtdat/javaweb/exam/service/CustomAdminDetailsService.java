package com.dtdat.javaweb.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dtdat.javaweb.exam.entity.Admin;
import com.dtdat.javaweb.exam.mapper.AdminMapper;
import com.dtdat.javaweb.exam.secure.CustomAdminDetails;

@Service
public class CustomAdminDetailsService implements UserDetailsService {

	@Autowired
	private AdminMapper adminMapper;

//	@Autowired
//	private PasswordEncoder encoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Admin admin = adminMapper.findByUsername(username);
		if (admin == null) {
			throw new UsernameNotFoundException("Admin not found");
		}
		return new CustomAdminDetails(admin);
	}

//	public Admin createAdmin(AdminCreateDTO request) {
//		Admin admin = new Admin();
//
//		admin.setUsername(request.getUsername());
//		admin.setPassword(encoder.encode(request.getPassword()));
//
//		adminMapper.insertAdmin(admin);
//
//		return admin;
//	}
}
