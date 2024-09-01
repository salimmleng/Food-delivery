const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
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
    } else {
      console.log(data); // Handle errors
    }
  })
  .catch(error => console.error('Error:', error));
});

