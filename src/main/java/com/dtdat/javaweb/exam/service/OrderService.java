package com.dtdat.javaweb.exam.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dtdat.javaweb.exam.entity.Order;
import com.dtdat.javaweb.exam.entity.Ward;
import com.dtdat.javaweb.exam.entity.Food;
import com.dtdat.javaweb.exam.dto.OrderCreateDTO;
import com.dtdat.javaweb.exam.dto.OrderItemDTO;
import com.dtdat.javaweb.exam.repository.OrderRepository;
import com.dtdat.javaweb.exam.repository.FoodRepository;
import com.dtdat.javaweb.exam.repository.WardRepository;

@Service
public class OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private FoodRepository foodRepository;

	@Autowired
	private WardRepository wardRepository;

	public Map<String, Object> getDashboardSummary() {
		LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
		LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
		return orderRepository.getDashboardSummary(todayStart, todayEnd);
	}

	public List<Map<String, Object>> getSalesChartData(String period, LocalDate startDate, LocalDate endDate) {
		LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
		LocalDateTime endDateTime = endDate != null ? endDate.atTime(LocalTime.MAX) : null;
		return orderRepository.getSalesChartData(startDateTime, endDateTime, period);
	}

	public Map<String, Object> getPagedOrders(String status, Integer orderId, LocalDate startDate, LocalDate endDate,
			int page, int size, String sortBy, String sortDir) {
		int offset = (page - 1) * size;
		if (offset < 0)
			offset = 0;

		LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
		LocalDateTime endDateTime = endDate != null ? endDate.atTime(LocalTime.MAX) : null;

		List<Order> orders = orderRepository.getOrders(status, orderId, startDateTime, endDateTime, offset, size,
				sortBy, sortDir);
		int totalElements = orderRepository.countOrders(status, orderId, startDateTime, endDateTime);

		Map<String, Object> response = new HashMap<>();
		response.put("content", orders);
		response.put("totalElements", totalElements);
		response.put("totalPages", (int) Math.ceil((double) totalElements / size));
		response.put("pageNumber", page);
		response.put("pageSize", size);
		response.put("first", page == 1);
		response.put("last", (page * size) >= totalElements);
		return response;
	}

	public Order getOrderDetails(int orderId) {
		Order order = orderRepository.getOrderById(orderId);
		if (order == null) {
			throw new IllegalArgumentException("No order found with ID: " + orderId);
		}
		return order;
	}

	@Transactional
    public int create(OrderCreateDTO orderCreateDTO) {
        BigDecimal calculatedTotal = BigDecimal.ZERO;
        if (orderCreateDTO.getItems() != null) {
            for (OrderItemDTO item : orderCreateDTO.getItems()) {
                Food food = foodRepository.getFoodById(item.getFoodId());
                if (food == null || !food.isStatus()) {
                    throw new IllegalArgumentException("Food not found or inactive with ID: " + item.getFoodId());
                }
                calculatedTotal = calculatedTotal.add(food.getPrice().multiply(new BigDecimal(item.getQuantity())));
            }
        }

        orderCreateDTO.setTotal(calculatedTotal);

        Ward ward = wardRepository.getById(orderCreateDTO.getWardId());
        if (ward == null) {
            throw new IllegalArgumentException("Ward not found with ID: " + orderCreateDTO.getWardId());
        }
        orderCreateDTO.setShippingFee(ward.getShippingFee());

        orderRepository.insertOrder(orderCreateDTO);

        int orderId = orderCreateDTO.getId();

        if (orderCreateDTO.getItems() != null && !orderCreateDTO.getItems().isEmpty()) {
            orderRepository.insertOrderItems(orderId, orderCreateDTO.getItems());
        }

        return orderId; 
    }

	public void updateOrderStatus(int orderId, String newState) {
		orderRepository.updateOrderState(orderId, newState);
	}
}