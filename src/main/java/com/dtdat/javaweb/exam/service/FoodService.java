package com.dtdat.javaweb.exam.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dtdat.javaweb.exam.dto.FoodCreateDTO;
import com.dtdat.javaweb.exam.dto.FoodUpdateDTO;
import com.dtdat.javaweb.exam.entity.Food;
import com.dtdat.javaweb.exam.repository.FoodRepository;

@Service
public class FoodService {

	@Autowired
	private FoodRepository foodRepository;

	private final String UPLOAD_BASE_DIR = "uploads/images/";

	private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

	public Map<String, Object> getPagedSortedFoods(int page, int size, String sort, String type, String search,
			String status) {
		int offset = (page - 1) * size;
		List<Food> foods = foodRepository.getFoodsPagedSorted(offset, size, sort, type, search, status);

		int total = foodRepository.countFoods(type, search, status);

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

	public Food createFood(FoodCreateDTO request, MultipartFile imageFile) throws IOException {
		Food food = new Food();
		BeanUtils.copyProperties(request, food);

		if (imageFile != null && !imageFile.isEmpty()) {
			String imageUrl = saveImageFile(imageFile, food.getType());
			food.setImage(imageUrl);
		}

		foodRepository.createFood(food);
		return food;
	}

	public Food updateFood(int id, FoodUpdateDTO request, MultipartFile imageFile) throws IOException {
		Food existingFood = foodRepository.getFoodById(id);

		if (existingFood == null) {
			throw new IllegalArgumentException("Food not found with id: " + id);
		}

		String oldType = existingFood.getType();
		String oldImageName = existingFood.getImage();

		existingFood.setName(request.getName());
		existingFood.setDescription(request.getDescription());
		existingFood.setPrice(request.getPrice());
		existingFood.setType(request.getType());

		if (imageFile != null && !imageFile.isEmpty()) {
			if (oldImageName != null && !oldImageName.isEmpty()) {
				deleteImageFile(oldImageName, oldType);
			}
			String newImageName = saveImageFile(imageFile, existingFood.getType());
			existingFood.setImage(newImageName);
		} else {
			String newType = existingFood.getType();
			if (!oldType.equals(newType) && oldImageName != null && !oldImageName.isEmpty()) {
				Path oldPath = Paths.get(UPLOAD_BASE_DIR + oldType + "s", oldImageName);
				Path newPath = Paths.get(UPLOAD_BASE_DIR + newType + "s", oldImageName);

				Files.createDirectories(newPath.getParent());

				Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);
			}
		}

		int updatedRows = foodRepository.updateFood(existingFood);

		if (updatedRows == 0) {
			throw new RuntimeException("Failed to update food with id: " + id);
		}

		return existingFood;
	}

	public void deleteFood(int id) {

		Food existingFood = foodRepository.getFoodById(id);
		if (existingFood == null) {
			throw new IllegalArgumentException("Food not found with id: " + id);
		}

		foodRepository.deleteFood(id);
	}

	private String saveImageFile(MultipartFile imageFile, String type) throws IOException {

		if (imageFile.getSize() > MAX_IMAGE_SIZE_BYTES) {
			throw new IllegalArgumentException("Image size exceeds the maximum limit of 5MB.");
		}

		String originalFilename = imageFile.getOriginalFilename();
		String fileExtension = "";
		if (originalFilename != null && originalFilename.lastIndexOf(".") != -1) {
			fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
		}
		String filename = UUID.randomUUID().toString() + fileExtension;

		Path uploadPath = Paths.get(UPLOAD_BASE_DIR + type + "s");

		Files.createDirectories(uploadPath);

		Path filePath = uploadPath.resolve(filename);
		Files.copy(imageFile.getInputStream(), filePath);

		return filename;
	}

	private void deleteImageFile(String fileName, String type) throws IOException {
		if (fileName == null || fileName.isEmpty()) {
			return;
		}
		Path filePath = Paths.get(UPLOAD_BASE_DIR + type + "s", fileName);
		if (Files.exists(filePath)) {
			Files.delete(filePath);
		}
	}
}