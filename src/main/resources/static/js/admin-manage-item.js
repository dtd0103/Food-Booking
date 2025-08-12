import { fetchFood, createFood, updateFood, deleteFood, fetchFoodById } from './api.js';
import { showToast } from './toast.js';

let currentPage = 1;
let currentSize = 10;
let currentSort = "";
let currentType = "food";
let currentSearch = "";
let currentStatus = "";

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById('food').classList.add('active');

	const foodSortPicker = document.getElementById('food-sort-picker');

	foodSortPicker.querySelectorAll('.type-picker').forEach(picker => {
		picker.addEventListener('click', (e) => {
			document.querySelectorAll('.type-picker').forEach(p => p.classList.remove('active'));
			e.target.classList.add('active');

			currentType = e.target.id;
			loadFoods(1, currentSize, currentSort, currentType, currentSearch, currentStatus);
		});
	});

	const itemPerPageSelector = document.getElementById('page-size');
	if (itemPerPageSelector) {
		itemPerPageSelector.addEventListener('change', function() {
			const selectedValue = parseInt(this.value);
			console.log("Selected page size:", selectedValue);
			loadFoods(1, selectedValue, currentSort, currentType, currentSearch, currentStatus);
		});
	}

	loadFoods(1, currentSize, currentSort, currentType, currentSearch, currentStatus);

	const searchForm = document.querySelector('.search-inner');
	const searchInput = document.getElementById('search-food-input');

	searchForm.addEventListener('submit', (e) => {
		e.preventDefault();
		currentSearch = searchInput.value;
		loadFoods(1, currentSize, currentSort, currentType, currentSearch, currentStatus);
	});

	const sortOptions = document.querySelectorAll('.sort-option');
	if (sortOptions.length > 0) {
		sortOptions.forEach(option => {
			option.addEventListener('click', (e) => {
				sortOptions.forEach(opt => opt.classList.remove('active'));
				e.target.classList.add('active');
				currentSort = e.target.dataset.sort;
				loadFoods(1, currentSize, currentSort, currentType, currentSearch, currentStatus);
			});
		});
	}
});

async function loadFoods(page, size, sort, type, search, status) {
	try {
		const data = await fetchFood(page, size, sort, type, search, status);

		currentPage = data.currentPage;
		currentSize = size;
		currentSort = sort;
		currentType = type;
		currentSearch = search;
		currentStatus = status;

		renderFoods(data);
		updatePagination(document.querySelector('.pagination'), data.currentPage, data.totalPages, data.totalItems);
	} catch (error) {
		console.error("Error loading foods:", error);
		const tableBody = document.getElementById('food-table-body');
		if (tableBody) {
			tableBody.innerHTML = '';
			const noDataRow = document.createElement('tr');
			noDataRow.innerHTML = `<td colspan="7" style="text-align: center; color: red;">Failed to load data. Please try again.</td>`;
			tableBody.appendChild(noDataRow);
		}
		const paginationContainer = document.querySelector('.pagination');
		if (paginationContainer) paginationContainer.innerHTML = '';
		const totalItemsDisplay = document.querySelector('.pagination-total-items');
		if (totalItemsDisplay) totalItemsDisplay.textContent = 'Total 0 items';
	}
}

function renderFoods(data) {
	const tableBody = document.getElementById('food-table-body');
	if (!tableBody) {
		console.error("Error: Element with ID 'food-table-body' not found.");
		return;
	}

	tableBody.innerHTML = '';

	const foods = data.foods;
	if (!foods || foods.length === 0) {
		const noDataRow = document.createElement('tr');
		noDataRow.innerHTML = `<td colspan="7" style="text-align: center;">No items found.</td>`;
		tableBody.appendChild(noDataRow);

		updatePagination(document.querySelector('.pagination'), 1, 1, 0);
		return;
	}

	foods.forEach((food, index) => {
		const tr = document.createElement('tr');
		const itemNumber = (data.currentPage - 1) * currentSize + index + 1;

		const imagePrefix = food.type === 'food' ? 'foods' : 'drinks';
		tr.dataset.foodId = food.id;
		tr.innerHTML = `
			<td>${itemNumber}</td>
			<td><img src="/uploads/images/${imagePrefix}/${food.image}" class="item-img" alt="${food.name}" /></td>
			<td>${food.name}</td>
			<td>${food.description}</td>
			<td>${food.price.toLocaleString('vi-VN')} đ</td>
			<td><img src="/images/switch-input${food.status ? '-active' : ''}.svg" class="input-img" data-food-id="${food.id}" data-current-status="${food.status}" /></td>
			<td>
				<span class="delete-item-btn" data-id="${food.id}">Delete</span>
				<span class="separate">|</span>
				<span class="edit-item-btn" data-id="${food.id}">Edit</span>
			</td>
		`;
		tableBody.appendChild(tr);

		const deleteBtn = tr.querySelector('.delete-item-btn');
		const editBtn = tr.querySelector('.edit-item-btn');

		if (deleteBtn) {
			deleteBtn.addEventListener('click', async () => {
				const foodIdToDelete = deleteBtn.dataset.id;
				if (confirm(`Are you sure you want to delete this item?`)) {
					try {
						await deleteFood(foodIdToDelete);
						showToast('success', 'Success', 'Item deleted successfully!');
						loadFoods(currentPage, currentSize, currentSort, currentType, currentSearch, currentStatus);
					} catch (error) {
						showToast('error', 'Error', `Error deleting item: ${error.message}`);
					}
				}
			});
		}

		if (editBtn) {
			editBtn.addEventListener('click', () => {
				const foodIdToEdit = editBtn.dataset.id;
				openUpdatePopup(foodIdToEdit);
			});
		}
	});

	updatePagination(document.querySelector('.pagination'), data.currentPage, data.totalPages, data.totalItems);
}

function updatePagination(container, currentPage, totalPages, totalItems) {
	if (!container) {
		console.error("Pagination container not found.");
		return;
	}
	container.innerHTML = '';

	const prevBtn = document.createElement('button');
	prevBtn.innerHTML = '&lt;';
	prevBtn.className = 'pagination-btn';
	prevBtn.disabled = currentPage === 1;
	prevBtn.addEventListener('click', () => {
		if (currentPage > 1) {
			loadFoods(currentPage - 1, currentSize, currentSort, currentType, currentSearch, currentStatus);
		}
	});
	container.appendChild(prevBtn);

	const createPageBtn = (i) => {
		const btn = document.createElement('button');
		btn.textContent = i + 1;
		btn.className = 'pagination-btn nums';
		if (i + 1 === currentPage) btn.classList.add('active');
		btn.addEventListener('click', () => {
			loadFoods(i + 1, currentSize, currentSort, currentType, currentSearch, currentStatus);
		});
		container.appendChild(btn);
	};

	for (let i = 0; i < totalPages; i++) {
		if (
			i === 0 ||
			i === totalPages - 1 ||
			(i >= currentPage - 3 && i <= currentPage + 1)
		) {
			createPageBtn(i);
		} else if (
			(i === currentPage - 4 && i > 0) ||
			(i === currentPage + 2 && i < totalPages - 1)
		) {
			const dots = document.createElement('span');
			dots.textContent = '...';
			dots.className = 'dots';
			container.appendChild(dots);
		}
	}

	const nextBtn = document.createElement('button');
	nextBtn.innerHTML = '&gt;';
	nextBtn.className = 'pagination-btn';
	nextBtn.disabled = currentPage === totalPages;
	nextBtn.addEventListener('click', () => {
		if (currentPage < totalPages) {
			loadFoods(currentPage + 1, currentSize, currentSort, currentType, currentSearch, currentStatus);
		}
	});
	container.appendChild(nextBtn);

	const itemPerPageSelector = document.getElementById('page-size');
	if (itemPerPageSelector) {
	}

	const totalItemContainer = document.querySelector('.pagination-total-items');
	if (totalItemContainer) {
		totalItemContainer.textContent = `Total ${totalItems} items`;
	}
}

const createItemBtn = document.getElementById('add-food-btn');
const overlay = document.querySelector('.overlay');
const createItemPopup = document.getElementById('create-item-popup');
const updateItemPopup = document.getElementById('update-item-popup');
const cancelCreatePopup = document.getElementById('form-create-cancel-btn');
const cancelUpdatePopup = document.getElementById('form-update-cancel-btn');

const handlePopupHelper = (btn, popup, closeBtn, overlay) => {
	if (btn) {
		btn.addEventListener('click', () => {
			popup.classList.add('show');
			overlay.classList.add('show');
		});
	}

	closeBtn.addEventListener('click', () => {
		popup.classList.remove('show');
		overlay.classList.remove('show');
	});
}

handlePopupHelper(createItemBtn, createItemPopup, cancelCreatePopup, overlay);
handlePopupHelper(null, updateItemPopup, cancelUpdatePopup, overlay);

const createImgInput = document.getElementById('create-image-file');
const createUploadBtn = document.querySelector('#create-item-popup .upload-image-btn');
const createImgPreview = document.querySelector('#create-item-popup .item-popup-img');
const createDeleteImgBtn = document.getElementById('create-delete-img');

let createSelectedImageFile = null;

if (createUploadBtn) {
	createUploadBtn.addEventListener('click', () => {
		if (createImgInput) {
			createImgInput.click();
		}
	});
}

if (createImgInput) {
	createImgInput.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			createSelectedImageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				if (createImgPreview) createImgPreview.src = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			createSelectedImageFile = null;
			if (createImgPreview) createImgPreview.src = '/images/image-placeholder.png';
		}
	});
}

if (createDeleteImgBtn) {
	createDeleteImgBtn.addEventListener('click', () => {
		createSelectedImageFile = null;
		if (createImgPreview) createImgPreview.src = '/images/image-placeholder.png';
		if (createImgInput) createImgInput.value = '';
	});
}

const createFoodTypePicker = document.getElementById('food-create-picker');
let createSelectedType = 'food';

if (createFoodTypePicker) {
	createFoodTypePicker.querySelectorAll('.type-picker').forEach(picker => {
		picker.addEventListener('click', (e) => {
			createFoodTypePicker.querySelectorAll('.type-picker').forEach(p => p.classList.remove('active'));
			e.target.classList.add('active');
			createSelectedType = e.target.id.split('-')[0];
		});
	});
	const defaultFoodTypePicker = document.getElementById('food-type');
	if (defaultFoodTypePicker) {
		defaultFoodTypePicker.classList.add('active');
	}
}

const createFoodForm = document.getElementById('create-item-popup');
if (createFoodForm) {
	createFoodForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const name = document.getElementById('name').value;
		const description = document.getElementById('description').value;
		const price = parseFloat(document.getElementById('price').value);

		const status = true;

		const foodData = {
			type: createSelectedType,
			name,
			description,
			price,
			status
		};

		try {
			await createFood(foodData, createSelectedImageFile);
			showToast('success', 'Success', 'Food created successfully!');
			createFoodForm.reset();
			if (createImgPreview) createImgPreview.src = '/images/image-placeholder.png';
			createSelectedImageFile = null;
			if (createImgInput) createImgInput.value = '';

			if (createFoodTypePicker) {
				createFoodTypePicker.querySelectorAll('.type-picker').forEach(p => p.classList.remove('active'));
				const foodTypeElement = createFoodTypePicker.querySelector('#food-type');
				if (foodTypeElement) foodTypeElement.classList.add('active');
			}
			createSelectedType = 'food';

			if (createItemPopup && overlay) {
				createItemPopup.classList.remove('show');
				overlay.classList.remove('show');
			}

			loadFoods(currentPage, currentSize, currentSort, currentType, currentSearch, currentStatus);
		} catch (error) {
			showToast('error', 'Error', `Error creating food: ${error.message}`);
		}
	});
}

const updateImgInput = document.getElementById('update-image-file');
const updateUploadBtn = document.querySelector('#update-item-popup .upload-image-btn');
const updateImgPreview = document.querySelector('#update-item-popup .item-popup-img');
const updateDeleteImgBtn = document.getElementById('update-delete-img');
let updateSelectedImageFile = null;
let currentFoodId = null;
let currentFoodImage = null;

const updateFoodTypePicker = document.getElementById('food-update-picker');
let updateSelectedType = 'food';

if (updateUploadBtn) {
	updateUploadBtn.addEventListener('click', () => {
		if (updateImgInput) {
			updateImgInput.click();
		}
	});
}

if (updateFoodTypePicker) {
	updateFoodTypePicker.querySelectorAll('.type-picker').forEach(picker => {
		picker.addEventListener('click', (e) => {
			updateFoodTypePicker.querySelectorAll('.type-picker').forEach(p => p.classList.remove('active'));
			e.target.classList.add('active');
			updateSelectedType = e.target.id.split('-')[1];
		});
	});
}

if (updateImgInput) {
	updateImgInput.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			updateSelectedImageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				if (updateImgPreview) updateImgPreview.src = e.target.result;
				if (updateDeleteImgBtn) updateDeleteImgBtn.style.display = 'block';
			};
			reader.readAsDataURL(file);
		} else {
			updateSelectedImageFile = null;
			if (updateImgPreview) updateImgPreview.src = currentFoodImage || '/images/image-placeholder.png';
			if (updateDeleteImgBtn) updateDeleteImgBtn.style.display = currentFoodImage ? 'block' : 'none';
		}
	});
}

if (updateDeleteImgBtn) {
	updateDeleteImgBtn.addEventListener('click', () => {
		updateSelectedImageFile = new File([], '');
		if (updateImgPreview) updateImgPreview.src = '/images/image-placeholder.png';
		if (updateDeleteImgBtn) updateDeleteImgBtn.style.display = 'none';
		if (updateImgInput) updateImgInput.value = '';
	});
}

async function openUpdatePopup(foodId) {
	currentFoodId = foodId;
	try {
		const food = await fetchFoodById(foodId);
		if (food) {
			document.getElementById('update-name').value = food.name;
			document.getElementById('update-description').value = food.description;
			document.getElementById('update-price').value = food.price;

			if (food.image) {
				const imageSrc = `/uploads/images/${food.type}s/${food.image}`;
				if (updateImgPreview) updateImgPreview.src = imageSrc;
				currentFoodImage = imageSrc;
				if (updateDeleteImgBtn) updateDeleteImgBtn.style.display = 'block';
			} else {
				if (updateImgPreview) updateImgPreview.src = '/images/image-placeholder.png';
				currentFoodImage = null;
				if (updateDeleteImgBtn) updateDeleteImgBtn.style.display = 'none';
			}
			if (updateImgInput) updateImgInput.value = '';

			console.log("Food type from backend:", food.type);
			if (updateFoodTypePicker) {
				updateFoodTypePicker.querySelectorAll('.type-picker').forEach(p => p.classList.remove('active'));
				const typeElement = document.getElementById(`update-${food.type}-type`);
				console.log("Type picker element found:", typeElement);

				if (typeElement) {
					typeElement.classList.add('active');
					updateSelectedType = food.type;
				} else {
					console.warn(`Unexpected food type '${food.type}' from backend. Defaulting update picker to 'food'.`);
					const foodTypeElement = document.getElementById('update-food-type');
					if (foodTypeElement) foodTypeElement.classList.add('active');
					updateSelectedType = 'food';
				}
			}

			if (updateItemPopup && overlay) {
				updateItemPopup.classList.add('show');
				overlay.classList.add('show');
			}
		}
	} catch (error) {
		console.error('Error fetching food for update:', error);
		showToast('error', 'Error', 'Failed to load food details for update.');
	}
}

const updateFoodForm = document.getElementById('update-item-popup');
if (updateFoodForm) {
	updateFoodForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const name = document.getElementById('update-name').value;
		const description = document.getElementById('update-description').value;
		const price = parseFloat(document.getElementById('update-price').value);

		let statusToSend = true;
		try {
			const existingFood = await fetchFoodById(currentFoodId);
			if (existingFood) {
				statusToSend = existingFood.status;
			}
		} catch (error) {
			console.warn("Could not fetch existing food status, defaulting to true.", error);
		}

		const foodData = {
			type: updateSelectedType,
			name,
			description,
			price,
			status: statusToSend
		};

		try {
			await updateFood(currentFoodId, foodData, updateSelectedImageFile);
			showToast('success', 'Success', 'Food updated successfully!');
			updateFoodForm.reset();
			if (updateImgPreview) updateImgPreview.src = '/images/image-placeholder.png';
			updateSelectedImageFile = null;
			currentFoodImage = null;
			if (updateImgInput) updateImgInput.value = '';

			if (updateItemPopup && overlay) {
				updateItemPopup.classList.remove('show');
				overlay.classList.remove('show');
			}

			loadFoods(currentPage, currentSize, currentSort, currentType, currentSearch, currentStatus);
		} catch (error) {
			showToast('error', 'Error', `Error updating food: ${error.message}`);
		}
	});
}