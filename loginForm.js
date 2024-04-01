document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(loginForm);
        const userData = Object.fromEntries(formData.entries());

        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                // If login is successful, retrieve the JWT token from response
                return response.json();
            } else {
                // If login fails, display error message
                return response.json().then(data => {
                    throw new Error(data.error || 'An error occurred. Please try again.');
                });
            }
        })
        .then(data => {
            // Store the JWT token in localStorage
            localStorage.setItem('token', data.token);
            // Store the user ID in session storage
            sessionStorage.setItem('userId', data.userId);
            // Redirect to index.html after successful login
            window.location.href = 'index.html';
        })
        .catch(error => {
            loginMessage.textContent = error.message;
            console.error('Error:', error);
        });
    });


    // Function to decode JWT token
    function decodeToken(token) {
        if (!token) {
            return null; // Return null if token is null
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload;
    }

    // Function to determine if user is admin based on JWT token
    function isAdmin(token) {
        if (!token) {
            return false; // Return false if token is null
        }
        const payload = decodeToken(token);
        return payload.isAdmin === true; // Adjust this based on the actual structure of your token payload
    }

    // Get JWT token from query parameter
    const token = new URLSearchParams(window.location.search).get('token');

    // Function to toggle event creation form based on user role
    function toggleEventCreationForm(isAdmin) {
        const form = document.getElementById('eventCreationForm');
        if (isAdmin) {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    }

    // Check if user is admin and toggle event creation form accordingly
    toggleEventCreationForm(isAdmin(token));
});

document.getElementById('showRegisterForm').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
});

// registrationForm.js
document.getElementById('showLoginForm').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
});