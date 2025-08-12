const BASKET_KEY = 'basket';

export function getBasket() {
	return JSON.parse(sessionStorage.getItem(BASKET_KEY)) || [];
}

export function saveBasket(basket) {
	sessionStorage.setItem(BASKET_KEY, JSON.stringify(basket));
}

export function addToBasket(foodId, quantity = 1) {
	const basket = getBasket();
	const existing = basket.find(item => item.id == foodId);
	if (existing) {
		existing.quantity += quantity;
	} else {
		basket.push({ id: parseInt(foodId), quantity });
	}
	saveBasket(basket);
}

export function removeFromBasket(foodId) {
	const basket = getBasket().filter(item => item.id != foodId);
	saveBasket(basket);
}

export function clearBasket() {
	sessionStorage.removeItem(BASKET_KEY);
}

export async function getBasketWithDetails() {
	const basket = getBasket();
	if (basket.length === 0) return [];

	const detailedItems = await Promise.all(
		basket.map(async (item) => {
			const res = await fetch(`/api/foods/${item.id}`);
			const food = await res.json();
			return {
				...food,
				quantity: item.quantity
			};
		})
	);

	return detailedItems;
}

export function checkBasketContain(itemId) {
	const basket = getBasket();
	return basket.some(item => item.id == itemId);
}

export function isBasketEmpty() {
    const basket = getBasket();
    return basket.length === 0;
}
