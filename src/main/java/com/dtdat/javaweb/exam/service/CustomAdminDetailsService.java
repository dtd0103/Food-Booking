package com.dtdat.javaweb.exam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dtdat.javaweb.exam.entity.Admin;
import com.dtdat.javaweb.exam.mapper.AdminMapper;
import com.dtdat.javaweb.exam.secure.CustomAdminDetails;

@Service
public class CustomAdminDetailsService implements UserDetailsService {

	@Autowired
	private AdminMapper adminMapper;

	@Lazy
	@Autowired
	private MessageDigestPasswordEncoder passwordEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Admin admin = adminMapper.findByUsername(username);
		if (admin == null) {
			throw new UsernameNotFoundException("Your password or account is incorrectly.");
		}
		return new CustomAdminDetails(admin);
	}

	public boolean changePassword(String username, String currentPassword, String newPassword) {
		Admin admin = adminMapper.findByUsername(username);
		if (admin == null) {
			return false;
		}

		if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
			return false;
		}

		String encodedNewPassword = passwordEncoder.encode(newPassword);
		adminMapper.updatePassword(username, encodedNewPassword);
		return true;
	}

	public void reauthenticateUser(String username, String newPassword) {
		UserDetails userDetails = loadUserByUsername(username);
		Authentication newAuthentication = new UsernamePasswordAuthenticationToken(userDetails, null,
				userDetails.getAuthorities());
		SecurityContextHolder.getContext().setAuthentication(newAuthentication);
	}
}