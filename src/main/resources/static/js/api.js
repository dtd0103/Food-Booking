const API_BASE = 'http://localhost:8080/api';
export async function fetchFood(page = 0, size = 0, sort = "", type = "food", search = "") {
	try {
		const res = await fetch(`${API_BASE}/foods?page=${page}&size=${size}&sort=${sort}&type=${type}&search=${search}`);
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

export async function fetchCity(){
	try {
			const res = await fetch(`${API_BASE}/city`);
			const data = await res.json();
			return data;
		} catch (err) {
			console.error('Fetch city error:', err);
		}
}

export async function fetchWardByCityId(cityId){
	try {
			const res = await fetch(`${API_BASE}/ward/city/${cityId}`);
			const data = await res.json();
			return data;
		} catch (err) {
			console.error('Fetch ward error:', err);
		}
}

export async function fetchOrderById(orderId){
	try {
			const res = await fetch(`${API_BASE}/orders/${orderId}`);
			const data = await res.json();
			return data;
		} catch (err) {
			console.error('Fetch order error:', err);
		}
}