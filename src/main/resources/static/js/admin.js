import { fetchOrder, fetchOrderById, fetchOrderSummary, updateOrderState } from './api.js';
import { showToast } from './toast.js';

function formatCurrency(amount) {
	if (typeof amount !== 'number') {
		return '0';
	}
	return amount.toLocaleString('vi-VN');
}

function formatDate(isoDateString) {
	if (!isoDateString) return '';
	const date = new Date(isoDateString);
	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getOrderStateInfo(state) {
	switch (state) {
		case 'new':
			return { className: 'new', displayName: 'New', icon: 'order-new.svg' };
		case 'shipping':
			return { className: 'shipping', displayName: 'Shipping', icon: 'order-shipping.svg' };
		case 'completed':
			return { className: 'completed', displayName: 'Completed', icon: 'order-completed.svg' };
		default:
			return { className: 'cancel', displayName: 'Cancel', icon: 'order-cancel.svg' };
	}
}

export function renderOrders(orders, containerElement) {
	if (!containerElement) {
		console.error("Container element for orders not found.");
		return;
	}

	containerElement.innerHTML = '';

	if (!orders || orders.length === 0) {
		containerElement.innerHTML = '<p>There\'s no orders.</p>';
		return;
	}

	orders.forEach(order => {
		const totalItemsInOrder = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
		const orderState = getOrderStateInfo(order.state);

		const orderHtml = `
			<div class="order" data-order-id=${order.id}>
				<div class="order-header">
					<div class="order-id">Order #${String(order.id).padStart(3, '0')}</div>
					<div class="order-date">${formatDate(order.createdAt)}</div>
				</div>
				<div class="order-item">
					<img class="order-img" src="/uploads/images/${order.items[0].food.type === 'food' ? 'foods' : 'drinks'}/${order.items[0].food.image}" alt="${order.items[0].food.name}" />
					<div class="order-item-content">
						<div class="order-item-name">${order.items[0].food.name}</div>
						<div class="order-item-description">${order.items[0].food.description}</div>
						<div class="order-item-nums">
							<div class="order-item-price">${formatCurrency(order.items[0].food.price)} <span>đ</span></div>
							<div class="order-item-quantity">Quantity: <span>${order.items[0].quantity}</span></div>
						</div>
					</div>
				</div>
				<div class="order-line"></div>
				<div class="order-total-item">${totalItemsInOrder} Items</div>
				<div class="order-summary">
					<div class="order-total-price">${formatCurrency(order.total)} <span>đ</span></div>
					<div class="order-state ${orderState.className}">
						<img class="state-icon" src="/images/${orderState.icon}" alt="${orderState.displayName}" />
						<div class="state-name">${orderState.displayName}</div>
					</div>
				</div>
			</div>`;
		containerElement.insertAdjacentHTML('beforeend', orderHtml);
	});

	const orderCards = document.querySelectorAll('.order');
	orderCards.forEach(card => {
		card.addEventListener('click', handleOrderCardClick);
	});
}

export function renderOrderPagination(paginationData, paginationContainer, onPageChange, onPageSizeChange) {
	if (!paginationContainer) {
		console.error("Pagination container element not found.");
		return;
	}

	const { pageNumber, totalPages, totalElements, pageSize } = paginationData;
	const paginationList = paginationContainer.querySelector('.pagination');
	const totalItemsSpan = paginationContainer.querySelector('.pagination-total-items');
	const pageSizeSelect = paginationContainer.querySelector('.page-size');

	if (!paginationList || !totalItemsSpan || !pageSizeSelect) {
		console.error("One or more required pagination elements not found in the container.");
		return;
	}

	totalItemsSpan.textContent = `Total ${totalElements} items`;

	paginationList.innerHTML = '';

	const prevBtn = document.createElement('button');
	prevBtn.innerHTML = '&lt';
	prevBtn.className = 'pagination-btn';
	prevBtn.disabled = pageNumber === 1;
	prevBtn.addEventListener('click', () => {
		if (pageNumber > 1) {
			onPageChange(pageNumber - 1);
		}
	});
	paginationList.appendChild(prevBtn);

	let addedDotsBefore = false;
	let addedDotsAfter = false;

	for (let i = 0; i < totalPages; i++) {
		const p = i + 1;

		if (
			i === 0 ||
			i === totalPages - 1 ||
			(i >= pageNumber - 3 && i <= pageNumber + 1)
		) {
			const btn = document.createElement('button');
			btn.textContent = p;
			btn.className = 'pagination-btn nums';
			if (p === pageNumber) {
				btn.classList.add('active');
			}
			btn.addEventListener('click', () => {
				onPageChange(p);
			});
			paginationList.appendChild(btn);
			addedDotsBefore = false;
			addedDotsAfter = false;
		} else {
			if (i < pageNumber - 3 && !addedDotsBefore && i > 0) {
				const dots = document.createElement('span');
				dots.textContent = '...';
				dots.className = 'dots';
				paginationList.appendChild(dots);
				addedDotsBefore = true;
			} else if (i > pageNumber + 1 && !addedDotsAfter && i < totalPages - 1) {
				const dots = document.createElement('span');
				dots.textContent = '...';
				dots.className = 'dots';
				paginationList.appendChild(dots);
				addedDotsAfter = true;
			}
		}
	}

	const nextBtn = document.createElement('button');
	nextBtn.innerHTML = '&gt';
	nextBtn.className = 'pagination-btn';
	nextBtn.disabled = pageNumber === totalPages;
	nextBtn.addEventListener('click', () => {
		if (pageNumber < totalPages) {
			onPageChange(pageNumber + 1);
		}
	});
	paginationList.appendChild(nextBtn);

	const pageSizeOptions = [12, 24, 40];
	pageSizeSelect.innerHTML = pageSizeOptions.map(optionSize => `
	<option value="${optionSize}" ${optionSize === pageSize ? 'selected' : ''}>${optionSize} / page</option>
	`).join('');

	pageSizeSelect.onchange = (e) => {
		onPageSizeChange(parseInt(e.target.value));
	};
}

const orderFilterState = {
	status: [],
	startDate: null,
	endDate: null,
	page: 1,
	size: 10,
	sortBy: '',
	sortDir: '',
	search: ''
};

function formatDateForApi(date) {
	if (!date) return null;
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

async function applyOrderFiltersAndSort() {
	try {
		const data = await fetchOrder(
			orderFilterState.page,
			orderFilterState.size,
			orderFilterState.sortBy,
			orderFilterState.sortDir,
			orderFilterState.status.join(','),
			formatDateForApi(orderFilterState.startDate),
			formatDateForApi(orderFilterState.endDate),
			orderFilterState.search
		);

		const orderListContainer = document.querySelector('.order-list');

		renderOrders(data.content, orderListContainer);

		const paginationContainer = document.querySelector('.pagination-container');
		if (paginationContainer) {
			renderOrderPagination(
				{
					pageNumber: data.pageNumber,
					totalPages: data.totalPages,
					totalElements: data.totalElements,
					pageSize: data.pageSize
				},
				paginationContainer,
				(newPage) => {
					orderFilterState.page = newPage;
					applyOrderFiltersAndSort();
				},
				(newSize) => {
					orderFilterState.size = newSize;
					orderFilterState.page = 1;
					applyOrderFiltersAndSort();
				}
			);
		} else {
			console.error("Pagination container not found.");
		}

	} catch (error) {
		console.error("Error applying filters/sort for orders:", error);
	}
}

function toggleDropdown(dropdownId) {
	const dropdown = document.getElementById(dropdownId);
	if (dropdown) {
		dropdown.classList.toggle('show');
	}
}

function handleStateFilterClick(event) {
	const selectedStateId = event.target.id;
	if (!selectedStateId) return;

	const filterOptionId = `state-${selectedStateId}`;
	const filterOptionElement = document.getElementById(filterOptionId);

	if (filterOptionElement) {
		if (filterOptionElement.style.display !== 'none') {
			filterOptionElement.style.display = 'none';
			orderFilterState.status = orderFilterState.status.filter(s => s !== selectedStateId);
		} else {
			filterOptionElement.style.display = 'flex';
			if (!orderFilterState.status.includes(selectedStateId)) {
				orderFilterState.status.push(selectedStateId);
			}
		}
		orderFilterState.page = 1;
		applyOrderFiltersAndSort();
	}
}

function handleRemoveStateFilterClick(event) {
	const removeIcon = event.target.closest('.filter-option').querySelector('img[src*="remove-option.svg"]');
	if (!removeIcon) return;

	const filterOption = event.target.closest('.filter-option');
	if (!filterOption) return;

	filterOption.style.display = 'none';
	const stateIdToRemove = filterOption.id.replace('state-', '');
	orderFilterState.status = orderFilterState.status.filter(s => s !== stateIdToRemove);

	orderFilterState.page = 1;
	applyOrderFiltersAndSort();
}

function handleDateSortClick(event) {
	const selectedDateRangeId = event.target.id;
	if (!selectedDateRangeId) return;

	const sortByDateElement = document.getElementById('sort-by-date');
	const sortByDateSpan = sortByDateElement.querySelector('span');

	let newStartDate = null;
	let newEndDate = null;
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	switch (selectedDateRangeId) {
		case 'all':
			sortByDateSpan.textContent = 'All';
			break;
		case 'today':
			sortByDateSpan.textContent = 'Today';
			newStartDate = today;
			newEndDate = today;
			break;
		case 'weel':
			sortByDateSpan.textContent = 'This Week';
			const firstDayOfWeek = new Date(today);
			firstDayOfWeek.setDate(today.getDate() - today.getDay());
			newStartDate = firstDayOfWeek;
			newEndDate = new Date(today);
			break;
		case 'month':
			sortByDateSpan.textContent = 'This Month';
			const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			newStartDate = firstDayOfMonth;
			newEndDate = new Date(today);
			break;
		default:
			console.warn('Unknown date range selected:', selectedDateRangeId);
			return;
	}

	orderFilterState.startDate = newStartDate;
	orderFilterState.endDate = newEndDate;
	orderFilterState.page = 1;
	applyOrderFiltersAndSort();
}

function closeOrderDetailPopup() {
	const orderPopup = document.querySelector('.order-popup');
	const orderPopupOverlay = document.querySelector('.overlay');
	if (orderPopup) {
		orderPopup.classList.remove('show');
	}
	if (orderPopupOverlay) {
		orderPopupOverlay.classList.remove('show');
	}
	const popupStateDropdown = document.querySelector('.popup-state-dropdown');
	if (popupStateDropdown) {
		popupStateDropdown.classList.remove('show');
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderOrderDetailPopup(order) {
	const popupId = document.querySelector('.order-popup-id');
	const popupDate = document.querySelector('.order-popup-date');
	const popupItemsCount = document.querySelector('.order-popup-items');
	const popupUsername = document.querySelector('.adress-username');
	const popupPhone = document.querySelector('.adress-phone');
	const popupLocation = document.querySelector('.adress-location');
	const popupItemList = document.querySelector('.popup-items');
	const popupItemsPriceTotal = document.getElementById('items-price-total');
	const popupShippingFee = document.getElementById('shipping-fee');
	const popupOrderTotalPrice = document.getElementById('order-total-price');
	const popupStateDiv = document.querySelector('.popup-state-wrapper .popup-state');

	popupId.textContent = `Order #${order.id}`;
	popupDate.textContent = formatDate(order.createdAt);
	popupItemsCount.textContent = `${order.items.length} Items`;

	popupUsername.textContent = order.userName;
	popupPhone.textContent = order.phoneNumber;

	const fullAddress = `${order.street}, ${order.ward.name}, ${order.ward.city.name}, Vietnam.`;
	popupLocation.textContent = fullAddress;

	popupItemList.innerHTML = '';
	let itemsSubtotal = 0;
	order.items.forEach(item => {
		const itemDiv = document.createElement('div');
		itemDiv.classList.add('popup-item');
		itemsSubtotal += item.food.price * item.quantity;
		itemDiv.innerHTML = `
			<img class="popup-img" src="/uploads/images/${item.food.type === 'food' ? 'foods' : 'drinks'}/${item.food.image}" alt="${item.food.name}"/>
			<div class="popup-item-content">
				<div class="popup-item-name">${item.food.name}</div>
				<div class="popup-item-description">${item.food.description || ''}</div>
				<div class="popup-item-nums">
					<div class="popup-item-price">${formatCurrency(item.food.price)}</div>
					<div class="popup-item-quantity">Quantity: <span>${item.quantity}</span></div>
				</div>
			</div>
		`;
		popupItemList.appendChild(itemDiv);
	});

	popupItemsPriceTotal.textContent = formatCurrency(itemsSubtotal);
	popupShippingFee.textContent = formatCurrency(order.shippingFee);
	popupOrderTotalPrice.textContent = formatCurrency(order.total);

	popupStateDiv.classList.remove('new', 'shipping', 'completed', 'cancel');
	popupStateDiv.classList.add(order.state);
	popupStateDiv.querySelector('.popup-state-content').textContent = capitalizeFirstLetter(order.state);
	popupStateDiv.querySelector('.popup-state-icon').src = `/images/order-${order.state}.svg`;
	popupStateDiv.querySelector('.popup-state-icon-right').src = `/images/icon-right-${order.state}.svg`;

	const orderPopup = document.querySelector('.order-popup');
	const orderPopupOverlay = document.querySelector('.overlay');

	if (orderPopup) {
		orderPopup.classList.add('show');
	}
	if (orderPopupOverlay) {
		orderPopupOverlay.classList.add('show');
	}
}

async function handleOrderCardClick(event) {
	const orderId = event.currentTarget.dataset.orderId;
	if (orderId) {
		const orderData = await fetchOrderById(orderId);
		if (orderData) {
			renderOrderDetailPopup(orderData);
		}
	}
}

async function renderDashboardSummary() {
	try {
		const summary = await fetchOrderSummary();

		if (summary) {
			const todaySalesElement = document.querySelector('.today-sales .sales-total');
			if (todaySalesElement) {
				todaySalesElement.textContent = formatCurrency(summary.todaySales) + ' đ';
			}

			const totalOrdersElement = document.querySelector('#total .sumary-item-total');
			if (totalOrdersElement) {
				totalOrdersElement.textContent = summary.totalOrders;
			}

			const shippingOrdersElement = document.querySelector('#shipping .sumary-item-total');
			if (shippingOrdersElement) {
				summary.shippingOrders = summary.shippingOrders !== null ? summary.shippingOrders : 0;
				shippingOrdersElement.textContent = summary.shippingOrders;
			}

			const completedOrdersElement = document.querySelector('#completed .sumary-item-total');
			if (completedOrdersElement) {
				summary.completedOrders = summary.completedOrders !== null ? summary.completedOrders : 0;
				completedOrdersElement.textContent = summary.completedOrders;
			}

			const cancelledOrdersElement = document.querySelector('#cancel .sumary-item-total');
			if (cancelledOrdersElement) {
				summary.cancelledOrders = summary.cancelledOrders !== null ? summary.cancelledOrders : 0;
				cancelledOrdersElement.textContent = summary.cancelledOrders;
			}
		}
	} catch (error) {
		console.error('Error rendering dashboard summary:', error);
		showToast('error', 'Error', 'Cannot load dashboard summary.');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	renderDashboardSummary();
	const urlParams = new URLSearchParams(window.location.search);

	if (urlParams.has('success')) {
		showToast('success', 'Login Success', 'You are logged in successfully.');
		urlParams.delete('success');
		const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
		history.replaceState(null, '', newUrl);
	}

	if (urlParams.has('passwordChanged')) {
		showToast('success', 'Change Password Success', 'Password changed successfully!');
		urlParams.delete('passwordChanged');
		const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
		history.replaceState(null, '', newUrl);
	}

	const closeButton = document.querySelector('.order-popup-close');
	if (closeButton) {
		closeButton.addEventListener('click', closeOrderDetailPopup);
	}

	const filterOptions = document.querySelectorAll('.filter-show-options .filter-option');
	filterOptions.forEach(option => option.style.display = 'none');

	document.getElementById('state-filter').addEventListener('click', () => toggleDropdown('state-dropdown'));
	document.getElementById('sort-by-date').addEventListener('click', () => toggleDropdown('date-dropdown'));

	const stateDropdownItems = document.querySelectorAll('#state-dropdown .filter-dropdown-item');
	stateDropdownItems.forEach(item => {
		item.addEventListener('click', handleStateFilterClick);
	});

	const filterShowOptionsContainer = document.querySelector('.filter-show-options');
	if (filterShowOptionsContainer) {
		filterShowOptionsContainer.addEventListener('click', (event) => {
			if (event.target.tagName === 'IMG' && event.target.src.includes('remove-option.svg')) {
				handleRemoveStateFilterClick(event);
			}
		});
	}

	const dateDropdownItems = document.querySelectorAll('#date-dropdown .filter-dropdown-item');
	dateDropdownItems.forEach(item => {
		item.addEventListener('click', handleDateSortClick);
	});

	const searchForm = document.querySelector('.search-inner');
	const searchInput = document.getElementById('search-order-input');

	searchForm.addEventListener('submit', (event) => {
		event.preventDefault();
		orderFilterState.search = searchInput.value;
		orderFilterState.page = 1;
		applyOrderFiltersAndSort();
	});

	const pageSizeSelect = document.getElementById('page-size');
	orderFilterState.size = parseInt(pageSizeSelect.value);

	applyOrderFiltersAndSort();

	const mainPopupStateDiv = document.querySelector('.popup-state-wrapper .popup-state');
	const popupStateDropdown = document.querySelector('.popup-state-dropdown');

	if (mainPopupStateDiv && popupStateDropdown) {
		mainPopupStateDiv.addEventListener('click', () => {
			popupStateDropdown.classList.toggle('show');
		});

		document.addEventListener('click', (event) => {
			if (!mainPopupStateDiv.contains(event.target) && !popupStateDropdown.contains(event.target)) {
				popupStateDropdown.classList.remove('show');
			}
		});
	}

	const stateDropdownItemsForPopup = document.querySelectorAll('.popup-state-dropdown .dropdown-item');

	stateDropdownItemsForPopup.forEach(item => {
		item.addEventListener('click', async (event) => {
			const newState = Array.from(event.currentTarget.classList)
				.find(cls => ['new', 'shipping', 'completed', 'cancel'].includes(cls));
			const currentOrderIdText = document.querySelector('.order-popup-id').textContent;
			const currentOrderId = parseInt(currentOrderIdText.replace('Order #', ''));

			if (currentOrderId && !isNaN(currentOrderId) && newState) {
				const mainPopupStateDiv = document.querySelector('.popup-state-wrapper .popup-state');
				const oldStateInfo = getOrderStateInfo(
					Array.from(mainPopupStateDiv.classList)
						.find(cls => ['new', 'shipping', 'completed', 'cancel'].includes(cls))
				);

				const newStateInfo = getOrderStateInfo(newState);
				mainPopupStateDiv.classList.remove(oldStateInfo.className);
				mainPopupStateDiv.classList.add(newStateInfo.className);
				mainPopupStateDiv.querySelector('.popup-state-content').textContent = newStateInfo.displayName;
				mainPopupStateDiv.querySelector('.popup-state-icon').src = `/images/${newStateInfo.icon}`;
				mainPopupStateDiv.querySelector('.popup-state-icon-right').src = `/images/icon-right-${newStateInfo.className}.svg`;

				popupStateDropdown.classList.remove('show');

				try {
					await updateOrderState(currentOrderId, newState);
					showToast('success', 'Update Success', `Order #${currentOrderId} status updated to ${newStateInfo.displayName}.`);
					applyOrderFiltersAndSort();
				} catch (error) {
					console.error('Error:', error);
					showToast('error', 'Update Erroe', error.message || `Cannot update state of order #${currentOrderId}.`);
					mainPopupStateDiv.classList.remove(newStateInfo.className);
					mainPopupStateDiv.classList.add(oldStateInfo.className);
					mainPopupStateDiv.querySelector('.popup-state-content').textContent = oldStateInfo.displayName;
					mainPopupStateDiv.querySelector('.popup-state-icon').src = `/images/${oldStateInfo.icon}`;
				}
			}
		});
	});

	const showNavBtn = document.getElementById('nav-icon');

	if (showNavBtn) {
		const navbar = document.querySelector('.navbar');

		showNavBtn.addEventListener('click', () => {
			navbar.style.display = "block";
			navbar.style.opacity = "1";
		});
	}
});