package com.dtdat.javaweb.exam.repository.implement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.dtdat.javaweb.exam.entity.Food;
import com.dtdat.javaweb.exam.mapper.FoodMapper;
import com.dtdat.javaweb.exam.repository.FoodRepository;

@Repository
public class FoodRepositoryImpl implements FoodRepository {
	@Autowired
	private FoodMapper foodMapper;

	public List<Food> getFoodsPagedSorted(int offset, int limit, String sort, String type, String search, String status) {
		return foodMapper.getFoodsPagedSorted(offset, limit, sort, type, search, status);
	}

	public int countFoods(String type, String search, String status) {
		return foodMapper.countFoods(type, search, status);
	}

	public Food getFoodById(int id) {
		return foodMapper.getFoodById(id);
	}

	public int createFood(Food food) {
		return foodMapper.createFood(food);
	}

	public int updateFood(Food food) {
		return foodMapper.updateFood(food);
	}

	public int deleteFood(int id) {
		return foodMapper.deleteFood(id);
	}
}