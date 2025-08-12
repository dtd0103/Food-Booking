const toastContainer = document.querySelector('.toast-message');

function hideToast() {
	if (toastContainer) {
		toastContainer.classList.remove('show');
		toastContainer.classList.add('hide');

		toastContainer.addEventListener('transitionend', function handler() {
			toastContainer.innerHTML = '';
			toastContainer.classList.remove('hide');
			toastContainer.removeEventListener('transitionend', handler);
		}, { once: true });
	}
}

export function showToast(type, title, message, duration = 3000) {
	if (!toastContainer) {
		console.error("Toast container with class '.toast-message' not found in the DOM.");
		return;
	}

	toastContainer.classList.remove('show', 'hide');
	toastContainer.innerHTML = '';

	let iconSrc;
	if (type === 'success') {
		iconSrc = '/images/message-success.svg';
	} else if (type === 'error') {
		iconSrc = '/images/message-error.svg';
	} else if (type === 'warning') {
		iconSrc = '/images/message-other.svg';
	} else {
		iconSrc = '';
	}

	const toastContentHTML = `
		<div class="toast-item"> <div class="toast-header ${type}">
			${iconSrc ? `<img src="${iconSrc}" class="toast-icon" alt="icon" />` : ''}
			<div class="toast-title">${title}</div>
				<button class="toast-close-btn">
				<img src="/images/toast-close-button.svg" class="toast-icon-close" alt="close icon" />
				</button>
			</div>
			<div class="toast-content ${type}">${message}</div>
		</div>
	`;

	toastContainer.innerHTML = toastContentHTML;

	setTimeout(() => {
		toastContainer.classList.add('show');
	}, 10);


	const hideTimeout = setTimeout(() => {
		hideToast();
	}, duration);

	const closeButton = toastContainer.querySelector('.toast-close-btn');
	if (closeButton) {
		closeButton.addEventListener('click', () => {
			clearTimeout(hideTimeout);
			hideToast();
		});
	}
}