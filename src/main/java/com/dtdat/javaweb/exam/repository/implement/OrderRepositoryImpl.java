package com.dtdat.javaweb.exam.repository.implement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.dtdat.javaweb.exam.dto.OrderCreateDTO; // Import OrderCreateDTO
import com.dtdat.javaweb.exam.dto.OrderItemDTO; // Import OrderItemDTO
import com.dtdat.javaweb.exam.entity.Order;
import com.dtdat.javaweb.exam.mapper.OrderMapper;
import com.dtdat.javaweb.exam.repository.OrderRepository;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

	@Autowired
	private OrderMapper orderMapper;

	public Map<String, Object> getDashboardSummary(LocalDateTime todayStart, LocalDateTime todayEnd) {
		return orderMapper.getDashboardSummary(todayStart, todayEnd);
	}

	public List<Map<String, Object>> getSalesChartData(LocalDateTime startDate, LocalDateTime endDate, String period) {
		return orderMapper.getSalesChartData(startDate, endDate, period);
	}

	public List<Order> getOrders(List<String> status, LocalDateTime startDate, LocalDateTime endDate, int offset,
			int limit, String sortBy, String sortDir, String search) {
		return orderMapper.getOrders(status, startDate, endDate, offset, limit, sortBy, sortDir, search);
	}

	public int countOrders(List<String> status, LocalDateTime startDate, LocalDateTime endDate, String search) {
		return orderMapper.countOrders(status, startDate, endDate, search);
	}

	public Order getOrderById(int id) {
		return orderMapper.getOrderById(id);
	}

	public int insertOrder(OrderCreateDTO order) {
		return orderMapper.insertOrder(order);
	}

	public void insertOrderItems(int orderId, List<OrderItemDTO> items) {
		orderMapper.insertOrderItems(orderId, items);
	}

	public void updateOrderState(int orderId, String newState) {
		orderMapper.updateOrderState(orderId, newState);
	}
}