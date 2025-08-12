import { showToast } from './toast.js';

document.getElementById('change-password-form').addEventListener('submit', function(event) {
	event.preventDefault();

	const currentPassword = document.getElementById('currentPassword').value;
	const newPassword = document.getElementById('newPassword').value;

	fetch('/admin/change-password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			currentPassword: currentPassword,
			newPassword: newPassword
		}),
	})
		.then(response => {
			if (response.ok) {
				window.location.href = '/admin.html?passwordChanged';
			} else {
				response.text().then(text => showToast('error', 'Error', `Error: ${text}`));
			}
		})
		.catch(error => {
			console.error('Error:', error);
			alert('An error occurred while changing password.');
		});
});