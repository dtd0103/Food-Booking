import { fetchCity, fetchWardByCityId } from './api.js';
import { getBasketWithDetails, clearBasket, isBasketEmpty } from './basket.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.form-cancel-btn').addEventListener('click', () => {
		//	window.location='index.html';
		window.location.replace("index.html");
	})

	if (isBasketEmpty()) {
		alert('Your basket is empty. Please add item to your basket to check out.');
		window.location.href = '/index.html';
	}

	loadCities();
	renderOrderInfomation();
	setupWardFeeHandler();
	setupOrderSubmission();
});

async function loadCities() {
	const cities = await fetchCity();

	const citySelect = document.getElementById('city');
	citySelect.innerHTML = '<option disabled selected>Choose City</option>';
	cities.forEach(city => {
		const option = document.createElement('option');
		option.value = city.id;
		option.textContent = city.name;
		citySelect.appendChild(option);

	});
}

async function loadWardsByCity(cityId) {
	const wards = await fetchWardByCityId(cityId);

	const wardSelect = document.getElementById('ward');
	wardSelect.innerHTML = '<option disabled selected>Choose Ward</option>';
	wards.forEach(ward => {
		const option = document.createElement('option');
		option.value = ward.id;
		option.textContent = `${ward.name} - Ship: ${ward.shippingFee.toLocaleString('vi-VN')} đ`;
		option.dataset.fee = ward.shippingFee;
		wardSelect.appendChild(option);
	});
}

function setupWardFeeHandler() {
	const wardSelect = document.getElementById('ward');
	const shippingFee = document.getElementById('shipping-fee');
	wardSelect.addEventListener('change', () => {
		const selected = wardSelect.selectedOptions[0];
		const fee = parseFloat(selected.dataset.fee || '0');

		shippingFee.textContent = `${fee.toLocaleString('vi-VN')}`;
		renderOrderInfomation();
	});
}

document.getElementById('city').addEventListener('change', (e) => {
	const cityId = e.target.value;
	loadWardsByCity(cityId);
});


export async function renderOrderInfomation() {
	const orderListEl = document.querySelector('.order-list');
	const total = document.getElementById('total-price');
	const shippingFee = document.getElementById('shipping-fee');
	const totalWithShipping = document.querySelector('.total-price-and-ship');

	const basket = await getBasketWithDetails();
	let totalQuantity = 0;
	let totalPrice = 0;

	basket.forEach(item => {
		totalQuantity += item.quantity;
		totalPrice += item.quantity * item.price;
	});

	orderListEl.innerHTML = '';
	total.innerHTML = `${totalPrice.toLocaleString('vi-VN')} đ`;
	totalWithShipping.innerHTML = `${(totalPrice + parseFloat(shippingFee.textContent * 1000)).toLocaleString('vi-VN')} đ`

	if (!basket.length) {
		orderListEl.innerHTML = '<p style="padding: 1rem;">No items.</p>';
		return;
	}

	basket.forEach(item => {
		const div = document.createElement('div');
		div.className = 'order-item';

		div.innerHTML = `<img src="/uploads/images/${item.type === 'food' ? 'foods' : 'drinks'}/${item.image}" class="item-img">
			<div class="item-info">
				<div class="item-name">${item.name}</div>
				<p class="item-desc">${item.description}</p>
			</div>
			<div class="item-right">
				<div class="item-price">${item.price.toLocaleString('vi-VN')} <span>đ</span></div>
				<div class="item-quantity">Quantity: <div>${item.quantity}</div>
				</div>
			</div>`;

		orderListEl.appendChild(div);
	});
}

function setupOrderSubmission() {
	const checkoutForm = document.getElementById('checkout-form');
	checkoutForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const userName = document.getElementById('name').value;
		const phoneNumber = document.getElementById('phone').value;
		const street = document.getElementById('street').value;
		const wardId = parseInt(document.getElementById('ward').value);
		const message = document.getElementById('message').value;

		const totalPriceElement = document.getElementById('total-price');
		const shippingFeeElement = document.getElementById('shipping-fee');

		const total = parseFloat(totalPriceElement.textContent.replace(/[.đ,]/g, ''));
		const shippingFee = parseFloat(shippingFeeElement.textContent.replace(/[.đ,]/g, ''));


		const basket = await getBasketWithDetails();
		const items = basket.map(item => ({
			foodId: item.id,
			quantity: item.quantity
		}));

		const orderData = {
			userName,
			phoneNumber,
			street,
			wardId,
			message,
			total,
			shippingFee,
			items
		};

		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(orderData)
			});

			if (response.ok) {
				const orderId = await response.json();

				clearBasket();

				sessionStorage.setItem('lastOrderId', orderId);

				window.location.replace('order-success.html');
			} else {
				const errorData = await response.json();

				for (const fieldName in errorData) {
					if (errorData.hasOwnProperty(fieldName)) {
						const errorMessage = errorData[fieldName];
						showToast('error', fieldName, errorMessage)
					}
				}
			}
		} catch (error) {
			for (const fieldName in error) {
				if (error.hasOwnProperty(fieldName)) {
					const errorMessage = error[fieldName];
					showToast('error', fieldName, errorMessage)
				}
			}
		}
	});
}