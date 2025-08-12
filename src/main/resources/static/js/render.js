import { loadFoods, currentPage, currentSize, currentSort, currentType, currentSearch } from './script.js';
import { checkBasketContain, addToBasket, getBasket, saveBasket, removeFromBasket, getBasketWithDetails } from './basket.js';
import { fetchFoodById, fetchOrderById } from './api.js';
import { showToast } from './toast.js';

export function renderFoods(data) {
	const container = document.querySelector('.food-list');
	container.innerHTML = '';

	if (!data || !data.foods || data.foods.length === 0) {
		container.innerHTML = '<p>No foods found.</p>';
		return;
	}

	const foods = data.foods;

	foods.forEach(food => {
		const div = document.createElement('div');
		let isBasketContain = checkBasketContain(food.id);
		const itemInBasket = getBasket().find(item => item.id === food.id);
		const imagePrefix = food.type === 'food' ? 'foods' : 'drinks';

		div.className = isBasketContain ? 'food-item active' : 'food-item';
		div.dataset.foodId = food.id;

		let divContent = isBasketContain ? `
			<img src="/uploads/images/${imagePrefix}/${food.image}" class="food-item-image" />
			<div class="food-item-info">
				<div class="food-item-name">${food.name}</div>
				<div class="food-item-description">${food.description}</div>
				<div class="food-item-price">${food.price.toLocaleString('vi-VN')} đ</div>
				<div class="food-item-action" data-id="${food.id}">
					<div class="item-delete-btn">
						<img src="/images/delete-icon.svg" />
					</div>
					<div class="item-number-input">
						<img src="/images/minus.svg" class="item-minus" />
						<span class="item-count">${itemInBasket ? itemInBasket.quantity : 1}</span>
						<img src="/images/plus.svg" class="item-plus" />
					</div>
				</div>
			</div>
		` : `
			<img src="/uploads/images/${imagePrefix}/${food.image}" class="food-item-image" />
			<div class="food-item-info">
				<div class="food-item-name">${food.name}</div>
				<div class="food-item-description">${food.description}</div>
				<div class="food-item-price">${food.price.toLocaleString('vi-VN')} đ</div>
				<div class="add-food-btn">
					<img src="/images/add-icon.svg" />
				</div>
			</div>
		`;

		div.innerHTML = divContent;
		container.appendChild(div);
	});

	document.querySelectorAll('.food-item').forEach(btn => {
		btn.addEventListener('click', (e) => {
			if (e.target.closest('.food-item-action')) return;
			const foodId = parseInt(btn.dataset.foodId);
			renderItemPopup(foodId);
		});
	});

	document.querySelectorAll('.food-item-action').forEach(action => {
		const id = parseInt(action.dataset.id);
		const minusBtn = action.querySelector('.item-minus');
		const plusBtn = action.querySelector('.item-plus');
		const deleteBtn = action.querySelector('.item-delete-btn');
		const countEl = action.querySelector('.item-count');

		minusBtn.onclick = () => {
			const basket = getBasket();
			const item = basket.find(i => i.id === id);
			if (item && item.quantity > 1) {
				item.quantity--;
				saveBasket(basket);
				countEl.textContent = item.quantity;
				updateBasketSummary();
				showToast('success', 'Update item quantity', 'Item quantity updated.');
			}
		};

		plusBtn.onclick = () => {
			const basket = getBasket();
			const item = basket.find(i => i.id === id);
			if (item) {
				item.quantity++;
				saveBasket(basket);
				countEl.textContent = item.quantity;
				updateBasketSummary();
				showToast('success', 'Update item quantity', 'Item quantity updated.');
			}
		};

		deleteBtn.onclick = () => {
			removeFromBasket(id);
			loadFoods(currentPage, currentSize, currentSort, currentType);
			updateBasketSummary();
			showToast('success', 'Remove item from cart', 'Item removed from your cart.');
		};
	});

	renderPagination(data.currentPage, data.totalPages, data.totalItems);
}


function renderPagination(currentPage, totalPages, totalItems) {
	const totalItemContainer = document.querySelector('.pagination-total-items');
	const itemPerPageSelector = document.getElementById('page-size');
	const container = document.querySelector('.pagination');
	container.innerHTML = '';
	const prevBtn = document.createElement('button');
	prevBtn.innerHTML = '&lt';
	prevBtn.className = 'pagination-btn';
	prevBtn.disabled = currentPage === 1;
	prevBtn.addEventListener('click', () => {
		if (currentPage > 1) {
			loadFoods(currentPage - 1, currentSize, currentSort, currentType, currentSearch);
		}
	});
	container.appendChild(prevBtn);
	const createPageBtn = (i) => {
		const btn = document.createElement('button');
		btn.textContent = i + 1;
		btn.className = 'pagination-btn nums';
		if (i + 1 === currentPage) btn.classList.add('active');
		btn.addEventListener('click', () => {
			loadFoods(i + 1, currentSize, currentSort, currentType, currentSearch);
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
	nextBtn.innerHTML = '&gt';
	nextBtn.className = 'pagination-btn';
	nextBtn.disabled = currentPage === totalPages;
	nextBtn.addEventListener('click', () => {
		if (currentPage < totalPages) {
			loadFoods(currentPage + 1, currentSize, currentSort, currentType, currentSearch);
		}
	});
	container.appendChild(nextBtn);

	itemPerPageSelector.addEventListener('change', function() {
		const selectedOption = this.options[this.selectedIndex];
		const value = selectedOption.value;
		console.log(value);
		loadFoods(currentPage, value, currentSort, currentType, currentSearch);
	});

	totalItemContainer.textContent = `Total ${totalItems} items`;
}


export async function renderItemPopup(foodId) {
	const container = document.querySelector('.item-popup-info');
	const addItemToBasketBtn = document.querySelector('.item-popup-add');
	const itemPopup = document.querySelector('.item-popup');

	container.innerHTML = '';
	const food = await fetchFoodById(foodId);

	itemPopup.dataset.foodId = food.id;
	const imagePrefix = food.type == 'food' ? 'foods' : 'drinks';

	container.innerHTML = `
		<img src="/uploads/images/${imagePrefix}/${food.image}" class="item-popup-img">
		<div class="item-popup-content">
			<p class="item-popup-name">${food.name}</p>
			<p class="item-popup-desc">${food.description}</p>
		</div>
		<div class="item-popup-price">${food.price.toLocaleString('vi-VN')} <span>đ</span></div>`;

	addItemToBasketBtn.dataset.price = food.price;
	addItemToBasketBtn.innerHTML = `Add to Basket - ${food.price.toLocaleString('vi-VN')} <span>đ</span>`;

	itemPopup.classList.add("show");
	document.querySelector('.overlay').classList.add("show");
}

export async function updateBasketSummary() {
	const basket = await getBasketWithDetails();

	const basketLogo = document.querySelector('.basket-logo');
	const checkBasketBtn = document.querySelector('.check-basket-btn');
	const basketCountTotal = document.querySelector('.basket-count-total');
	const basketTotal = document.querySelector('.basket-total');

	if (!basket || basket.length === 0) {
		basketLogo.style.display = 'block';
		checkBasketBtn.style.display = 'none';
	} else {
		basketLogo.style.display = 'none';
		checkBasketBtn.style.display = 'flex';

		let totalQuantity = 0;
		let totalPrice = 0;

		basket.forEach(item => {
			totalQuantity += item.quantity;
			totalPrice += item.quantity * item.price;
		});

		basketCountTotal.textContent = totalQuantity;
		basketTotal.textContent = `${totalPrice.toLocaleString('vi-VN')} đ`;
	}
}

export async function renderBasketPopup() {
	const basketListEl = document.querySelector('.basket-popup-list');
	const total = document.querySelector('.basket-popup-total-price');
	const basketFooter = document.querySelector('.basket-popup-footer');
	const basket = await getBasketWithDetails();
	let totalQuantity = 0;
	let totalPrice = 0;

	basket.forEach(item => {
		totalQuantity += item.quantity;
		totalPrice += item.quantity * item.price;
	});

	basketListEl.innerHTML = '';
	total.innerHTML = `${totalPrice.toLocaleString('vi-VN')} đ`;


	if (!basket.length) {
		basketListEl.innerHTML = '<p style="padding: 1rem;">No items.</p>';
		basketFooter.style.display = 'none';
		return;
	}

	basketFooter.style.display = 'block';

	basket.forEach(item => {
		const div = document.createElement('div');
		div.className = 'basket-item';

		div.innerHTML = `
			<div class="basket-popup-item" data-id="${item.id}">
				<img src="/uploads/images/${item.type === 'food' ? 'foods' : 'drinks'}/${item.image}" class="basket-popup-img">
				<div class="basket-popup-content">
					<p class="basket-popup-name">${item.name}</p>
					<p class="basket-popup-desc">${item.description}</p>
				</div>
				<div class="basket-popup-right">
					<div class="basket-popup-price">${item.price.toLocaleString('vi-VN')} <span>đ</span></div>
					<div class="basket-popup-justify">
						<div class="basket-popup-minus"><img src="/images/basket-minus.svg" /></div>
						<span class="basket-count">${item.quantity}</span>
						<div class="basket-popup-plus"><img src="/images/basket-plus.svg" /></div>
					</div>
				</div>
			</div>

			<div class="basket-delete-item" data-id="${item.id}">
				<img src="/images/basket-close.svg" />
			</div>

			<div class="basket-popup-line"></div>

			<div class="basket-popup-item-total">${(item.price * item.quantity).toLocaleString('vi-VN')} <span>đ</span></div>
		`;

		basketListEl.appendChild(div);

		const minusBtn = div.querySelector('.basket-popup-minus');
		const plusBtn = div.querySelector('.basket-popup-plus');
		const countEl = div.querySelector('.basket-count');
		const totalEl = div.querySelector('.basket-popup-total');
		const deleteBtn = div.querySelector('.basket-delete-item');

		minusBtn.onclick = () => {
			const basket = getBasket();
			const found = basket.find(i => i.id === item.id);
			if (found && found.quantity > 1) {
				found.quantity--;
				saveBasket(basket);
				countEl.textContent = found.quantity;
				total.textContent = `${(found.quantity * item.price).toLocaleString('vi-VN')} đ`;
				updateBasketSummary();
				showToast('success', 'Update item quantity', 'Item quantity updated.');
			}
		};

		plusBtn.onclick = () => {
			const basket = getBasket();
			const found = basket.find(i => i.id === item.id);
			if (found) {
				found.quantity++;
				saveBasket(basket);
				countEl.textContent = found.quantity;
				total.textContent = `${(found.quantity * item.price).toLocaleString('vi-VN')} đ`;
				updateBasketSummary();
				showToast('success', 'Update item quantity', 'Item quantity updated.');
			}
		};

		deleteBtn.onclick = () => {
			removeFromBasket(item.id);
			renderBasketPopup();
			updateBasketSummary();
			loadFoods(currentPage, currentSize, currentSort, currentType);
			showToast('success', 'Remove item from cart', 'Item removed from your cart.');
		};
	});
}


document.addEventListener('DOMContentLoaded', () => {
	const orderPopup = document.querySelector('.order-popup');
	const orderPopupCloseBtn = document.querySelector('.order-popup-close');
	const checkOrderBtn = document.querySelector('.check-order-btn');

	const orderCodeSpan = document.getElementById('order-code-span');
	const orderItemsList = orderPopup ? orderPopup.querySelector('.order-list') : null;


	const totalItemsPriceEl = document.getElementById('total-items-price');
	const shippingFeeDisplayEl = document.getElementById('shipping-fee-display');
	const totalBillPriceEl = document.getElementById('total-bill-price');

	const orderShowMoreBtn = orderPopup ? orderPopup.querySelector('.order-show-more') : null;
	const showMoreIcon = orderShowMoreBtn ? orderShowMoreBtn.querySelector('.show-more-icon') : null;


	const stepperIcon1 = document.querySelector('.stepper-icon-1');
	const stepperIcon2 = document.querySelector('.stepper-icon-2');
	const stepperIcon3 = document.querySelector('.stepper-icon-3');
	const stepperIcon4 = document.querySelector('.stepper-icon-4');
	const steperLine1 = document.querySelector('.steper-line-1');
	const steperLine2 = document.querySelector('.steper-line-2');
	const steperLine3 = document.querySelector('.steper-line-3');

	const statusIcons = [
		{ icon: stepperIcon1, line: steperLine1, name: 'new', finished: '/images/steper-finished.svg', progress: '/images/steper-progress.svg', new: '/images/stepper-new.svg' },
		{ icon: stepperIcon2, line: steperLine2, name: 'preparing', finished: '/images/steper-finished.svg', progress: '/images/steper-progress.svg', new: '/images/stepper-new.svg' },
		{ icon: stepperIcon3, line: steperLine3, name: 'shipping', finished: '/images/steper-finished.svg', progress: '/images/steper-progress.svg', new: '/images/stepper-new.svg' },
		{ icon: stepperIcon4, line: null, name: 'completed', finished: '/images/steper-finished.svg', progress: '/images/steper-progress.svg', new: '/images/stepper-new.svg' }
	];

	const orderStatusTextElement = document.getElementById('orderStatusText');
	const steperEl = document.querySelector('.steper');

	function updateOrderStatus(status) {
		console.log(status);
		if (status === 'cancel') {
			if (steperEl) steperEl.style.display = 'none';
			if (orderStatusTextElement) {
				orderStatusTextElement.textContent = 'Order has been Canceled';
				orderStatusTextElement.style.display = 'block';
			}
			statusIcons.forEach((step) => {
				if (step.icon) step.icon.style.display = 'none';
				if (step.line) step.line.style.display = 'none';
			});
			return;
		}

		if (steperEl) steperEl.style.display = '';
		if (orderStatusTextElement) {
			orderStatusTextElement.textContent = '';
			orderStatusTextElement.style.display = 'none';
		}
		statusIcons.forEach((step) => {
			if (step.icon) step.icon.style.display = '';
			if (step.line) step.line.style.display = '';
		});

		let foundCurrentStatus = false;
		statusIcons.forEach((step) => {
			if (step.name === status) {
				foundCurrentStatus = true;
				if (step.icon) {
					step.icon.src = (step.name === 'completed') ? step.finished : step.progress;
				}
				if (step.line) step.line.classList.remove('finished');
			} else if (!foundCurrentStatus) {
				if (step.icon) step.icon.src = step.finished;
				if (step.line) step.line.classList.add('finished');
			} else {
				if (step.icon) step.icon.src = step.new;
				if (step.line) step.line.classList.remove('finished');
			}
		});
	}

	const hideOrderContent = () => {
		const steperEl = document.querySelector('.steper');
		const orderShowMoreEl = document.querySelector('.order-show-more');
		const orderPriceInfos = document.querySelectorAll('.order-price-info');
		const orderTotalEl = document.querySelector('.order-total');
		const lineEl = document.querySelector('.form-bottom > .line');
		const orderCodeDiv = document.querySelector('.order-code');

		if (steperEl) steperEl.style.display = 'none';
		if (orderCodeDiv) orderCodeDiv.style.display = 'none';
		if (orderShowMoreEl) orderShowMoreEl.style.display = 'none';
		orderPriceInfos.forEach(el => { if (el) el.style.display = 'none'; });
		if (orderTotalEl) orderTotalEl.style.display = 'none';
		if (lineEl) lineEl.style.display = 'none';
	};


	const showOrderContent = () => {
		const steperEl = document.querySelector('.steper');
		const orderShowMoreEl = document.querySelector('.order-show-more');
		const orderPriceInfos = document.querySelectorAll('.order-price-info');
		const orderTotalEl = document.querySelector('.order-total');
		const lineEl = document.querySelector('.form-bottom > .line');
		const orderCodeDiv = document.querySelector('.order-code');

		if (steperEl) steperEl.style.display = '';
		if (orderCodeDiv) orderCodeDiv.style.display = '';
		if (orderShowMoreEl) orderShowMoreEl.style.display = '';
		orderPriceInfos.forEach(el => { if (el) el.style.display = ''; });
		if (orderTotalEl) orderTotalEl.style.display = '';
		if (lineEl) lineEl.style.display = '';
	};

	async function displayLastOrderInfo() {

		const lastOrderId = sessionStorage.getItem('lastOrderId');

		if (!lastOrderId) {
			showToast('warning', 'Order not found', 'No recent orders in history. Please choose food and process to check out.');
			if (orderPopup) orderPopup.classList.remove('show');
			document.querySelector('.overlay').classList.remove('show');
			return;
		}

		if (orderPopup) {
			orderPopup.classList.add('show');
			document.querySelector('.overlay').classList.add('show');
		}


		if (orderCodeSpan) orderCodeSpan.textContent = `#${lastOrderId}`;
		hideOrderContent();
		if (orderItemsList) {
			orderItemsList.innerHTML = '<p style="text-align: center; padding: 20px;">Loading...</p>';
			orderItemsList.style.display = '';
		}

		let order = null;
		try {
			order = await fetchOrderById(lastOrderId);

			if (!order) {
				throw new Error('Unable to load order details from server.');
			}

		} catch (error) {
			console.error('Error loading order details:', error);
			hideOrderContent();
			if (orderItemsList) {
				orderItemsList.innerHTML = `
					<div class="order-error-message" style="text-align: center; padding: 20px; color: red;">
						<h3>Unable to load order details #${lastOrderId}.</h3>
						<p>An error occurred while retrieving data. Please try again later or contact support.</p>
					</div>
				`;
				orderItemsList.style.display = '';
			}
			showToast('error', 'Order loading error', `Unable to load order details #${lastOrderId}.`);
			return;
		}


		showOrderContent();
		if (orderItemsList) {
			orderItemsList.innerHTML = '';
		}

		if (orderCodeSpan) orderCodeSpan.textContent = `#${order.id}`;

		let renderedItemsCount = 0;

		for (const item of order.items) {
			const productDetail = item.food;
			const orderItemQuantity = item.quantity;

			if (productDetail) {
				const div = document.createElement('div');
				div.className = 'order-item';
				div.innerHTML = `
					<img class="item-img" src="/uploads/images/${productDetail.type === 'food' ? 'foods' : 'drinks'}/${productDetail.image}">
					<div class="item-info">
						<div class="item-name">${productDetail.name || 'No name'}</div>
						<p class="item-desc">${productDetail.description || 'No description.'}</p>
					</div>
					<div class="item-right">
						<div class="item-price">${productDetail.price.toLocaleString('vi-VN')} <span>đ</span></div> <div class="item-quantity">Quantity: <div>${orderItemQuantity}</div></div>
					</div>
				`;
				if (orderItemsList) orderItemsList.appendChild(div);
				renderedItemsCount++;
			}
		}

		const showMoreBtn = document.querySelector('.order-show-more'); const showMoreIcon = document.querySelector('.show-more-icon');
		let isShowMore = false;
		showMoreBtn.addEventListener('click', () => {
			if (!isShowMore) {
				isShowMore = true;
				orderItemsList.style.maxHeight = '390px';
				orderItemsList.style.overflowY = 'scroll';
				showMoreIcon.src = "/images/double-arrow-up.svg";
			}
			else {
				isShowMore = false;
				orderItemsList.style.maxHeight = '162px';
				orderItemsList.style.overflowY = 'hidden';
				showMoreIcon.src = "/images/double-arrow.svg";
			}
		})


		if (totalItemsPriceEl) totalItemsPriceEl.textContent = `${order.total.toLocaleString('vi-VN')}`;
		if (shippingFeeDisplayEl) shippingFeeDisplayEl.textContent = `${order.shippingFee.toLocaleString('vi-VN')}`;
		if (totalBillPriceEl) totalBillPriceEl.innerHTML = `${(order.total + order.shippingFee).toLocaleString('vi-VN')} <div>đ</div>`;


		const orderStatus = order.state || 'new';
		if (typeof updateOrderStatus === 'function') {
			updateOrderStatus(orderStatus);
		}
	}


	if (checkOrderBtn) {
		checkOrderBtn.addEventListener('click', displayLastOrderInfo);
	}


	if (orderPopupCloseBtn) {
		orderPopupCloseBtn.addEventListener('click', () => {
			orderPopup.classList.remove('show');
			document.querySelector('.overlay').classList.remove('show');
		});
	}
});