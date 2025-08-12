package com.dtdat.javaweb.exam.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.dtdat.javaweb.exam.entity.Food;

@Mapper
public interface FoodMapper {
	List<Food> getFoodsPagedSorted(int offset, int limit, String sort, String type, String search);

	int countFoods(String type);

	Food getFoodById(int id);


	void createFood(Food food);
	
	int updateFood(Food food);
	
	int deleteFood(int id);
}