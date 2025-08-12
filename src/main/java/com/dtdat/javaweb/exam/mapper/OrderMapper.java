package com.dtdat.javaweb.exam.mapper;

import com.dtdat.javaweb.exam.entity.Order;
import com.dtdat.javaweb.exam.dto.OrderCreateDTO;
import com.dtdat.javaweb.exam.dto.OrderItemDTO;
import org.apache.ibatis.annotations.Mapper;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper {

    Map<String, Object> getDashboardSummary(LocalDateTime todayStart, LocalDateTime todayEnd);

    List<Map<String, Object>> getSalesChartData(LocalDateTime startDate, LocalDateTime endDate, String period);

    List<Order> getOrders(String status, Integer orderId, LocalDateTime startDate, LocalDateTime endDate, int offset, int limit, String sortBy, String sortDir);

    int countOrders(String status, Integer orderId, LocalDateTime startDate, LocalDateTime endDate);

    Order getOrderById(int id);


    int insertOrder(OrderCreateDTO order);


    void insertOrderItems(int orderId, List<OrderItemDTO> items);


    void updateOrderState(int orderId, String newState);
}