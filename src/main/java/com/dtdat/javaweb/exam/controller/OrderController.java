package com.dtdat.javaweb.exam.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dtdat.javaweb.exam.dto.OrderCreateDTO;
import com.dtdat.javaweb.exam.dto.OrderStatusUpdateDTO;
import com.dtdat.javaweb.exam.entity.Order;
import com.dtdat.javaweb.exam.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@GetMapping("/summary")
	public ResponseEntity<Map<String, Object>> getDashboardSummary() {
		Map<String, Object> summary = orderService.getDashboardSummary();
		return ResponseEntity.ok(summary);
	}

	@GetMapping("/sales-chart")
	public ResponseEntity<List<Map<String, Object>>> getSalesChartData(
			@RequestParam(defaultValue = "day") String period,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
		List<Map<String, Object>> chartData = orderService.getSalesChartData(period, startDate, endDate);
		return ResponseEntity.ok(chartData);
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> getOrders(@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "") String sortBy,
			@RequestParam(defaultValue = "") String sortDir, @RequestParam(required = false) List<String> status,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
			@RequestParam(required = false) String search) {

		Map<String, Object> response = orderService.getPagedOrders(status, startDate, endDate, page, size, sortBy,
				sortDir, search);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Order> getOrderById(@PathVariable int id) {
		Order order = orderService.getOrderDetails(id);
		return ResponseEntity.ok(order);
	}

	@PostMapping
	public ResponseEntity<Integer> createOrder(@RequestBody @Valid OrderCreateDTO request) {
		int orderId = orderService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(orderId);
	}

	@PutMapping("/status")
	public ResponseEntity<String> updateOrderStatus(@RequestBody OrderStatusUpdateDTO statusUpdateDTO) {
		if (statusUpdateDTO.getNewState() == null || statusUpdateDTO.getNewState().isEmpty()) {
			return ResponseEntity.badRequest().body("New state cannot be empty.");
		}
		orderService.updateOrderStatus(statusUpdateDTO.getOrderId(), statusUpdateDTO.getNewState());
		return ResponseEntity.ok("Order status updated successfully.");
	}
}