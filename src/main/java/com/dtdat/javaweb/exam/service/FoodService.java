package com.dtdat.javaweb.exam.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dtdat.javaweb.exam.entity.Food;
import com.dtdat.javaweb.exam.repository.FoodRepository;

@Service
public class FoodService {

	@Autowired
	private FoodRepository foodRepository;

	private final String UPLOAD_BASE_DIR = "uploads/images/";

	public Map<String, Object> getPagedSortedFoods(int page, int size, String sort, String type, String search) {
		int offset = (page - 1) * size;
		List<Food> foods = foodRepository.getFoodsPagedSorted(offset, size, sort, type, search);

		int total = foodRepository.countFoods(type);

		Map<String, Object> result = new HashMap<>();
		result.put("foods", foods);
		result.put("currentPage", page);
		result.put("totalItems", total);
		if (size != 0) {
			result.put("totalPages", (int) Math.ceil((double) total / size));
		} else {
			result.put("totalPages", 0);
		}

		return result;
	}

	public Food getFoodById(int id) {
		Food food = foodRepository.getFoodById(id);

		if (food == null) {
			throw new IllegalArgumentException("No food found.");
		}

		return food;
	}


	private String saveImageFile(MultipartFile file, String foodType) throws IOException {
		String subfolder = foodType.equalsIgnoreCase("drink") ? "drinks/" : "foods/";
		Path uploadPath = Paths.get(UPLOAD_BASE_DIR + subfolder).toAbsolutePath().normalize();
		Files.createDirectories(uploadPath);

		String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
		Path filePath = uploadPath.resolve(fileName);
		Files.copy(file.getInputStream(), filePath);

		return UPLOAD_BASE_DIR + subfolder + fileName;
	}


	private void deleteImageFile(String filePath) throws IOException {
		if (filePath != null && !filePath.isEmpty()) {
			Path fileToDelete = Paths.get(filePath).toAbsolutePath().normalize();
			if (Files.exists(fileToDelete)) {
				Files.delete(fileToDelete);
			}
		}
	}


	public Food createFood(Food food, MultipartFile imageFile) throws IOException {
		food.setStatus(true);

		if (imageFile != null && !imageFile.isEmpty()) {
			String imageUrl = saveImageFile(imageFile, food.getType());
			food.setImage(imageUrl);
		}

		foodRepository.createFood(food);
		return food;
	}


	public Food updateFood(int id, Food foodDetails, MultipartFile imageFile) throws IOException {
		Food existingFood = foodRepository.getFoodById(id);
		if (existingFood == null) {
			throw new IllegalArgumentException("Food not found with id: " + id);
		}

		if (imageFile != null && !imageFile.isEmpty()) {
			deleteImageFile(existingFood.getImage());
			String imageUrl = saveImageFile(imageFile, foodDetails.getType());
			foodDetails.setImage(imageUrl);
		} else {

			foodDetails.setImage(existingFood.getImage());
		}


		existingFood.setType(foodDetails.getType());
		existingFood.setImage(foodDetails.getImage()); 
		existingFood.setName(foodDetails.getName());
		existingFood.setDescription(foodDetails.getDescription());
		existingFood.setPrice(foodDetails.getPrice());
		existingFood.setStatus(foodDetails.isStatus());

		int updatedRows = foodRepository.updateFood(existingFood);
		if (updatedRows == 0) {
			throw new RuntimeException("Failed to update food with id: " + id);
		}
		return existingFood;
	}


	public void deleteFood(int id) throws IOException {
		Food existingFood = foodRepository.getFoodById(id);
		if (existingFood == null) {
			throw new IllegalArgumentException("Food not found with id: " + id);
		}


		int updatedRows = foodRepository.deleteFood(id);
		if (updatedRows == 0) {
			throw new RuntimeException("Failed to soft delete food with id: " + id);
		}
	}
}