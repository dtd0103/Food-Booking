import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', function() {
	const urlParams = new URLSearchParams(window.location.search);
	const loginForm = document.getElementById('login-form');
	const usernameInput = document.getElementById('username');
	const passwordInput = document.getElementById('password');

	function displayFieldError(inputElement, message) {

		clearFieldError(inputElement);

		const errorSpan = document.createElement('span');
		errorSpan.className = 'field-error-message';
		errorSpan.style.color = 'red';
		errorSpan.textContent = message;

		inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);


		inputElement.value = '';
	}

	function clearFieldError(inputElement) {
		const existingError = inputElement.parentNode.querySelector('.field-error-message');
		if (existingError) {
			existingError.remove();
		}
	}

	if (loginForm) {
		loginForm.addEventListener('submit', function(event) {
			clearFieldError(usernameInput);
			clearFieldError(passwordInput);

			let isValid = true;

			if (usernameInput.value.trim() === '') {
				displayFieldError(usernameInput, 'Please input account');
				isValid = false;
			}


			if (passwordInput.value.trim() === '') {
				displayFieldError(passwordInput, 'Please input password');
				isValid = false;
			}

			if (!isValid) {
				event.preventDefault();
			}
		});
	}



	if (urlParams.has('error')) {
		showToast('error', 'Login Failed', 'Your password or account is incorrectly.');
		passwordInput.value = '';
	} else if (urlParams.has('logout')) {
		showToast('success', 'Logout Successful', 'You have successfully logged out.');
	}

	if (urlParams.has('error') || urlParams.has('logout')) {
		const cleanUrl = window.location.origin + window.location.pathname;
		window.history.replaceState({}, document.title, cleanUrl);
	}
});