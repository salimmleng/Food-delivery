document.addEventListener('DOMContentLoaded', function() {
  // Sign Up Form handling
  const signUpForm = document.getElementById('sign-up-form');
  
  if (signUpForm) {
    signUpForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const user_role = document.getElementById('signup_user_role').value;
      const username = document.getElementById('signup-username').value;
      const first_name = document.getElementById('signup-first_name').value;
      const last_name = document.getElementById('signup-last_name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
  
      fetch('http://127.0.0.1:8000/account/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_role: user_role,
          username: username,
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
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
          localStorage.setItem('user_role', data.user_role);
          
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

const handleLogout = () => {
  const token = localStorage.getItem("token");
  console.log(token)

  fetch("http://127.0.0.1:8000/account/logout/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("username");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
};


