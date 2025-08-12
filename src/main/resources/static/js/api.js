const API_BASE = 'http://localhost:8080/api';

export async function fetchFood(page = 0, size = 0, sort = "", type = "food", search = "", status = "") {
	try {
		let url = `${API_BASE}/foods?page=${page}&size=${size}&sort=${sort}&type=${type}&search=${search}`;
		if (status !== null && status !== "") {
			url += `&status=${status}`;
		}

		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch food error:', err);
	}
}

export async function fetchFoodById(foodId) {
	try {
		const res = await fetch(`${API_BASE}/foods/${foodId}`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch food error:', err);
	}
}

export async function createFood(foodData, imageFile) {
	try {
		const formData = new FormData();
		for (const key in foodData) {
			formData.append(key, foodData[key]);
		}
		if (imageFile) {
			formData.append('imageFile', imageFile);
		}

		const res = await fetch(`${API_BASE}/foods`, {
			method: 'POST',
			body: formData,
		});

		if (!res.ok) {
			let errorMessage = 'Failed to create food item.';
			try {
				const errorData = await res.json();
				if (errorData && errorData.error) {
					errorMessage = errorData.error;
				} else if (errorData && errorData.name) {
					errorMessage = errorData.name;
				} else if (errorData && errorData.description) {
					errorMessage = errorData.description;
				} else if (errorData && errorData.price) {
					errorMessage = errorData.price;
				} else if (errorData && errorData.message) {
					errorMessage = errorData.message;
				} else {
					errorMessage = `HTTP error! status: ${res.status}`;
				}
			} catch (jsonError) {
				console.warn('Response was not JSON for error:', await res.text());
				errorMessage = `HTTP error! status: ${res.status}`;
			}
			throw new Error(errorMessage);
		}

		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Create food error:', err);
		throw err;
	}
}

export async function updateFood(foodId, foodData, imageFile) {
	try {
		const formData = new FormData();
		for (const key in foodData) {
			formData.append(key, foodData[key]);
		}
		if (imageFile instanceof File) {
			formData.append('imageFile', imageFile);
		} else if (imageFile === null) {
			formData.append('imageFile', new File([], ''));
		}

		const res = await fetch(`${API_BASE}/foods/${foodId}`, {
			method: 'PUT',
			body: formData,
		});

		if (!res.ok) {
			let errorMessage = 'Failed to update food item.';
			try {
				const errorData = await res.json();
				if (errorData && errorData.error) {
					errorMessage = errorData.error;
				} else if (errorData && errorData.name) {
					errorMessage = errorData.name;
				} else if (errorData && errorData.description) {
					errorMessage = errorData.description;
				} else if (errorData && errorData.price) {
					errorMessage = errorData.price;
				} else if (errorData && errorData.message) {
					errorMessage = errorData.message;
				} else {
					errorMessage = `HTTP error! status: ${res.status}`;
				}
			} catch (jsonError) {
				console.warn('Response was not JSON for error:', await res.text());
				errorMessage = `HTTP error! status: ${res.status}`;
			}
			throw new Error(errorMessage);
		}

		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Update food error:', err);
		throw err;
	}
}

export async function deleteFood(foodId) {
	try {
		const res = await fetch(`${API_BASE}/foods/${foodId}`, {
			method: 'DELETE',
		});

		if (!res.ok) {
			let errorMessage = 'Failed to delete food item.';
			try {
				const errorData = await res.json();
				if (errorData && errorData.error) {
					errorMessage = errorData.error;
				} else if (errorData && errorData.message) {
					errorMessage = errorData.message;
				} else {
					errorMessage = `HTTP error! status: ${res.status}`;
				}
			} catch (jsonError) {
				console.warn('Response was not JSON for error:', await res.text());
				errorMessage = `HTTP error! status: ${res.status}`;
			}
			throw new Error(errorMessage);
		}
		return true;
	} catch (err) {
		console.error('Delete food error:', err);
		throw err;
	}
}

export async function fetchCity() {
	try {
		const res = await fetch(`${API_BASE}/city`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch city error:', err);
	}
}

export async function fetchWardByCityId(cityId) {
	try {
		const res = await fetch(`${API_BASE}/ward/city/${cityId}`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch ward error:', err);
	}
}

export async function fetchOrderSummary() {
	try {
		const res = await fetch(`${API_BASE}/orders/summary`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch order summary error:', err);
	}
}

export async function fetchOrder(
	page = 1,
	size = 10,
	sortBy = "",
	sortDir = "",
	status = "",
	startDate = "",
	endDate = "",
	search = ""
) {
	try {
		const params = new URLSearchParams();

		params.append('page', page.toString());
		params.append('size', size.toString());

		if (sortBy) {
			params.append('sortBy', sortBy);
		}
		if (sortDir) {
			params.append('sortDir', sortDir);
		}
		if (status) {
			params.append('status', status);
		}
		if (startDate) {
			params.append('startDate', startDate);
		}
		if (endDate) {
			params.append('endDate', endDate);
		}
		if (search) {
			params.append('search', search);
		}

		const queryString = params.toString();
		const url = `${API_BASE}/orders${queryString ? `?${queryString}` : ''}`;

		const res = await fetch(url);

		if (!res.ok) {
			let errorMessage = `HTTP error! status: ${res.status}`;
			try {
				const errorData = await res.json();
				errorMessage = errorData.message || JSON.stringify(errorData);
			} catch (jsonError) {
				console.warn('Response was not JSON for error:', await res.text());
			}
			throw new Error(`Failed to fetch orders: ${errorMessage}`);
		}

		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch order error:', err);
	}
}

export async function fetchOrderById(orderId) {
	try {
		const res = await fetch(`${API_BASE}/orders/${orderId}`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error('Fetch order error:', err);
	}
}

export async function updateOrderState(orderId, newState) {
	console.log(orderId, newState);
	try {
		const res = await fetch(`${API_BASE}/orders/status`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				orderId: orderId,
				newState: newState,
			}),
		});

		if (!res.ok) {
			let errorMessage = `HTTP error! status: ${res.status}`;
			try {
				const errorData = await res.json();
				if (errorData && errorData.error) {
					errorMessage = errorData.error;
				} else {
					errorMessage = JSON.stringify(errorData);
				}
			} catch (jsonParseError) {
				const textError = await res.text();
				errorMessage = textError || errorMessage;
				console.warn('Backend error response was not JSON or empty:', textError);
			}
			throw new Error(errorMessage);
		}

		return true;
	}
	catch (err) {
		console.error('Failed to update order state:', err);
		throw err;
	}
}