import { renderFoods, updateBasketSummary, renderBasketPopup } from './render.js';
import { fetchFood } from './api.js';
import { addToBasket } from './basket.js';
import { showToast } from './toast.js';

export let currentPage = 1;
export let currentSize = 4;
export let currentSort = "";
export let currentType = "food";
export let currentSearch = "";


function showSkeletonLoaders(count) {
	const foodList = document.querySelector('.food-list');
	foodList.innerHTML = '';
	for (let i = 0; i < count; i++) {
		const skeletonItemHTML = `
			<div class="food-item skeleton">
				<div class="skeleton-image"></div>
				<div class="food-item-info">
					<div class="skeleton-text skeleton-text-short"></div>
					<div class="skeleton-text skeleton-text-medium"></div>
					<div class="skeleton-text skeleton-text-price"></div>
					<div class="food-item-action skeleton-action">
						<div class="skeleton-button"></div>
						<div class="skeleton-input"></div>
					</div>
				</div>
			</div>
		`;
		foodList.insertAdjacentHTML('beforeend', skeletonItemHTML);
	}
}

// Fetch data
document.addEventListener("DOMContentLoaded", () => {
	loadFoods(1, 4, "", "food", "");
	updateBasketSummary();
});

export async function loadFoods(page = 1, size = 4, sort = "", type = "food", search = "", status = "1") {
	currentPage = page;
	currentSize = size;
	currentSort = sort;
	currentType = type;
	currentSearch = search;

	showSkeletonLoaders(currentSize);


	await new Promise(resolve => setTimeout(resolve, 300));


	const data = await fetchFood(page, size, sort, type, search, status);
	renderFoods(data);
}

// Search functionality
const topSearchForm = document.getElementById('top-search-input');
const heroSearchForm = document.querySelector('.search .search-inner');
const topSearchInputField = topSearchForm.querySelector('.search-input');
const heroSearchInputField = heroSearchForm.querySelector('.search-input');

topSearchForm.addEventListener('submit', (e) => {
	e.preventDefault();
});

heroSearchForm.addEventListener('submit', (e) => {
	e.preventDefault();
});

topSearchInputField.addEventListener('input', (e) => {
	const searchTerm = e.target.value;
	heroSearchInputField.value = searchTerm;
	// loadFoods(1, currentSize, currentSort, currentType, searchTerm);
});

heroSearchInputField.addEventListener('input', (e) => {
	const searchTerm = e.target.value;
	topSearchInputField.value = searchTerm;
	// loadFoods(1, currentSize, currentSort, currentType, searchTerm); 
});

topSearchInputField.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		const searchTerm = e.target.value;
		loadFoods(1, currentSize, currentSort, currentType, searchTerm);
	}
});

heroSearchInputField.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		const searchTerm = e.target.value;
		loadFoods(1, currentSize, currentSort, currentType, searchTerm);
	}
});

// Picker
const foodPicker = document.querySelector('.food-picker');
foodPicker.addEventListener('click', () => {
	loadFoods(1, currentSize, currentSort, "food", currentSearch);
	foodPicker.classList.toggle('active');
	drinkPicker.classList.toggle('active');
});

const drinkPicker = document.querySelector('.drink-picker');
drinkPicker.addEventListener('click', () => {
	loadFoods(1, currentSize, currentSort, "drink", currentSearch);
	foodPicker.classList.toggle('active');
	drinkPicker.classList.toggle('active');
});

// Sort
const sortField = document.querySelector('.sort-field');
const sortOption = document.querySelector('.sort-dropdown');

let isSortDropdownOpen = false;

sortField.addEventListener('click', () => {
	if (!isSortDropdownOpen) {
		isSortDropdownOpen = true;
		sortOption.classList.add('show');
	}
	else {
		isSortDropdownOpen = false;
		sortOption.classList.remove('show');
	}
});

document.querySelector('.low-to-high').addEventListener('click', () => {
	loadFoods(1, currentSize, "price_asc", currentType, currentSearch);
	sortField.querySelector('span').textContent = 'Price: From low to high';
	sortOption.classList.remove('show');
});

document.querySelector('.high-to-low').addEventListener('click', () => {
	loadFoods(1, currentSize, "price_desc", currentType, currentSearch);
	sortField.querySelector('span').textContent = 'Price: From high to low';
	sortOption.classList.remove('show');
});

// Scroll header
const hero = document.getElementById('hero');
const header = document.querySelector('header');
const topSearchInput = document.getElementById('top-search-input');
const checkOrderBtn = document.querySelector('.check-order-btn');
const searchInput = document.querySelector('.search');
const typePicker = document.querySelector('.food-type-picker');
function isElementInViewport(el) {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
window.addEventListener('scroll', function() {
	if (!isElementInViewport(hero)) {
		header.style.backgroundColor = "#fff";
		topSearchInput.classList.add("show");
		searchInput.style.opacity = '0';
		typePicker.style.display = 'fixed';
	}
	else {
		header.style.backgroundColor = "transparent";
		topSearchInput.classList.remove("show");
		searchInput.style.opacity = '1';
	}
});


// Popup Event
const basketBtn = document.querySelector('.basket-logo');
const overlay = document.querySelector('.overlay');
const basketPopup = document.querySelector('.basket-popup');
const closeBasketPopupBtn = document.querySelector('.basket-popup-close');
const checkBasketBtn = document.querySelector('.check-basket-btn');

basketBtn.addEventListener('click', () => {
	basketPopup.classList.toggle('show');
	overlay.classList.toggle('show');
	renderBasketPopup();
})

checkBasketBtn.addEventListener('click', () => {
	basketPopup.classList.toggle('show');
	overlay.classList.toggle('show');
	renderBasketPopup();
})

closeBasketPopupBtn.addEventListener('click', () => {
	basketPopup.classList.toggle('show');
	overlay.classList.toggle('show');
})

// Justify food item quantity
document.addEventListener('DOMContentLoaded', () => {
	const minusItemBtn = document.querySelector('.item-popup-minus');
	const plusItemBtn = document.querySelector('.item-popup-plus');
	const itemPopupCnt = document.querySelector('.item-popup-count');
	const itemPopup = document.querySelector('.item-popup');
	const closeItemPopupBtn = document.querySelector('.item-popup-close');
	const addItemToBasketBtn = document.querySelector('.item-popup-add');

	let itemCnt = 1;

	minusItemBtn.addEventListener('click', () => {
		if (itemCnt > 1) {
			itemCnt--;
			itemPopupCnt.textContent = itemCnt;
			updatePopupPrice();
			updateBasketSummary();

		}
	});

	plusItemBtn.addEventListener('click', () => {
		itemCnt++;
		itemPopupCnt.textContent = itemCnt;
		updatePopupPrice();
		updateBasketSummary();
	});

	addItemToBasketBtn.addEventListener('click', () => {
		const foodId = itemPopup.dataset.foodId;
		addToBasket(foodId, itemCnt);
		itemCnt = 1;
		itemPopupCnt.textContent = itemCnt;

		itemPopup.classList.remove("show");
		document.querySelector('.overlay').classList.remove("show");
		updateBasketSummary();
		loadFoods(currentPage, currentSize, currentSort, currentType);
		showToast('success', 'Add Item to Cart', 'Item added to your cart.');
	});

	closeItemPopupBtn.addEventListener('click', () => {
		itemCnt = 1;
		itemPopupCnt.textContent = itemCnt;
		itemPopup.classList.remove('show');
		overlay.classList.remove('show');
	});

	function updatePopupPrice() {
		const price = parseFloat(addItemToBasketBtn.dataset.price);
		addItemToBasketBtn.innerHTML = `Add to Basket ${price * itemCnt} - <span>đ</span>`;
	}
});
