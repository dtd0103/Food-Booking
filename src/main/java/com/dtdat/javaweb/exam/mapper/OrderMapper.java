package com.dtdat.javaweb.exam.mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.dtdat.javaweb.exam.dto.OrderCreateDTO;
import com.dtdat.javaweb.exam.dto.OrderItemDTO;
import com.dtdat.javaweb.exam.entity.Order;

@Mapper
public interface OrderMapper {

	Map<String, Object> getDashboardSummary(LocalDateTime todayStart, LocalDateTime todayEnd);

	List<Map<String, Object>> getSalesChartData(LocalDateTime startDate, LocalDateTime endDate, String period);

	List<Order> getOrders(List<String> status, LocalDateTime startDate, LocalDateTime endDate, int offset, int limit,
			String sortBy, String sortDir, String search);

	int countOrders(List<String> status, LocalDateTime startDate, LocalDateTime endDate, String search);

	Order getOrderById(int id);

	int insertOrder(OrderCreateDTO order);

	void insertOrderItems(int orderId, List<OrderItemDTO> items);

	void updateOrderState(int orderId, String newState);
}