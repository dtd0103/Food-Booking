document.addEventListener('DOMContentLoaded', function() {
	const urlParams = new URLSearchParams(window.location.search);
	const errorMessageDiv = document.getElementById('errorMessage');
	const logoutMessageDiv = document.getElementById('logoutMessage');

	if (urlParams.has('error')) {
		errorMessageDiv.style.display = 'block';
	} else {
		errorMessageDiv.style.display = 'none';
	}

	if (urlParams.has('logout')) {
		logoutMessageDiv.style.display = 'block';
	} else {
		logoutMessageDiv.style.display = 'none';
	}

	if (urlParams.has('error') || urlParams.has('logout')) {
		const cleanUrl = window.location.origin + window.location.pathname;
		window.history.replaceState({}, document.title, cleanUrl);
	}
});
