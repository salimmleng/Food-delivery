const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



const signUpForm = document.getElementById('sign-up-form');
const signInForm = document.getElementById('sign-in-form');

signUpForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  fetch('http://127.0.0.1:8000/account/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.username) {
      alert('Registration successful! Please log in.');
    } else {
      console.log(data); // Handle errors
    }
  })
  .catch(error => console.error('Error:', error));
});

signInForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('signin-username').value;
  const password = document.getElementById('signin-password').value;

  fetch('http://127.0.0.1:8000/account/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      alert('Login successful! Token: ' + data.token);
      // Store token locally (e.g., in localStorage) for authenticated requests
      localStorage.setItem('token', data.token);
      window.location.href = 'profile.html';
    } else {
      console.log(data); // Handle errors
    }

  })
  .catch(error => console.error('Error:', error));
});

