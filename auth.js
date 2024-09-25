document.addEventListener('DOMContentLoaded', function() {
  // Sign Up Form handling
  const signUpForm = document.getElementById('sign-up-form');
  
  if (signUpForm) {
    signUpForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
  
      fetch('https://foodapi-flame.vercel.app/account/register/', {
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
          // Assuming there's a Bootstrap modal with this ID to display alerts
          const alertModal = new bootstrap.Modal(document.getElementById("customAlertModal"));
          alertModal.show();
        } else {
          console.error('Registration failed:', data);
        }
      })
      .catch(error => console.error('Error during registration:', error));
    });
  }

  // Sign In Form handling
  const signInForm = document.getElementById('sign-in-form');
  
  if (signInForm) {
    signInForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const username = document.getElementById('signin-username').value;
      const password = document.getElementById('signin-password').value;
  
      if (!username || !password) {
        alert('Please fill in both username and password fields.');
        return;
      }
  
      fetch('https://foodapi-flame.vercel.app/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          alert('Login successful! Token: ' + data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', data.user_id);
          window.location.href = 'index.html';
        } else {
          alert('Login failed. Invalid credentials.');
          console.error('Login error:', data);
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
      });
    });
  }
});


