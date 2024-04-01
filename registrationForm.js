// registrationForm.js
document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const registrationMessage = document.getElementById('registrationMessage');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(registrationForm);
        const userData = Object.fromEntries(formData.entries());

        fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                // Upon successful registration, retrieve the user ID from response
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Registration failed');
                });
            }
        })
        .then(data => {
            // Store the user ID in session storage
            sessionStorage.setItem('userId', data.userId);
            // Redirect to index.html upon successful registration
            window.location.href = 'index.html';
        })
        .catch(error => {
            registrationMessage.textContent = error.message;
            console.error('Error:', error);
        });
    });
});