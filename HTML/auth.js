$(document).ready(function() {
    // Register Form Submission
    $('#register-form').on('submit', function(e) {
        e.preventDefault();

        let username = $('#username').val();
        let password = $('#password').val();

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(user => user.username === username)) {
            alert('Username already exists. Please choose another one.');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! You can now log in.');
            window.location.href = 'login.html';
        }
    });

    // Login Form Submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();

        let username = $('#username').val();
        let password = $('#password').val();

        let users = JSON.parse(localStorage.getItem('users')) || [];

        let user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password.');
        }
    });

    // Check if the user is logged in
    if (localStorage.getItem('loggedInUser')) {
        // Perform some actions if the user is logged in
        console.log('User is logged in.');
    } else {
        // Redirect to login page if the user is not logged in
        if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('register.html')) {
            window.location.href = 'login.html';
        }
    }
});
