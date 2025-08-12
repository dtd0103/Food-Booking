package com.dtdat.javaweb.exam.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.dtdat.javaweb.exam.service.CustomAdminDetailsService;

@Configuration
public class SecurityConfig {

	@Autowired
	private CustomAdminDetailsService adminDetailsService;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth.requestMatchers("/admin**").authenticated()
						.requestMatchers("uploads/**").permitAll().anyRequest().permitAll())
				.formLogin(form -> form.loginPage("/login.html").defaultSuccessUrl("/admin.html", true).permitAll()
						.failureUrl("/login.html?error").permitAll())
				.logout(logout -> logout.logoutUrl("/logout").invalidateHttpSession(true).deleteCookies("JSESSIONID")
						.logoutSuccessUrl("/login.html?logout").permitAll());

		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public MessageDigestPasswordEncoder passwordEncoder() {
		return new MessageDigestPasswordEncoder("MD5");
	}
}