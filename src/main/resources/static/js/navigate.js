document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.navbar-dashboard').addEventListener('click', () => {
		window.location = 'admin.html'
	})

	document.querySelector('.navbar-manage').addEventListener('click', () => {
		window.location = 'admin-manage-item.html';
	})

	document.querySelector('.navbar-password').addEventListener('click', () => {
		window.location = 'admin-change-password.html'
	})

	document.querySelector('.navbar-logout').addEventListener('click', () => {
		window.location = 'logout';
	})
});