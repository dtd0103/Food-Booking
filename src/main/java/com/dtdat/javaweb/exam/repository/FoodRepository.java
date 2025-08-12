package com.dtdat.javaweb.exam.repository;

import java.util.List;

import com.dtdat.javaweb.exam.entity.Food;

public interface FoodRepository {
	public List<Food> getFoodsPagedSorted(int offset, int limit, String sort, String type, String search, String status);

	public int countFoods(String type, String search, String status);

	public Food getFoodById(int id);

	public int createFood(Food food);

	public int updateFood(Food food);

	public int deleteFood(int id);
}