package com.dtdat.javaweb.exam.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dtdat.javaweb.exam.dto.FoodCreateDTO;
import com.dtdat.javaweb.exam.dto.FoodUpdateDTO;
import com.dtdat.javaweb.exam.entity.Food;
import com.dtdat.javaweb.exam.service.FoodService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

	@Autowired
	private FoodService foodService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> getFoods(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "0") int size, @RequestParam(defaultValue = "") String sort,
			@RequestParam(defaultValue = "") String type, @RequestParam(defaultValue = "") String search,
			@RequestParam(required = false, defaultValue = "") String status) {
		Map<String, Object> response = foodService.getPagedSortedFoods(page, size, sort, type, search, status);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Food> getFoodById(@PathVariable int id) {
		Food found = foodService.getFoodById(id);
		return ResponseEntity.ok(found);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Food> createFood(@ModelAttribute @Valid FoodCreateDTO request,
			@RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
		Food createdFood = foodService.createFood(request, imageFile);
		return new ResponseEntity<>(createdFood, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Food> updateFood(@PathVariable int id, @ModelAttribute @Valid FoodUpdateDTO request,
			@RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
		Food updatedFood = foodService.updateFood(id, request, imageFile);
		return ResponseEntity.ok(updatedFood);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteFood(@PathVariable int id) throws IOException {
		foodService.deleteFood(id);
		return ResponseEntity.noContent().build();
	}
}