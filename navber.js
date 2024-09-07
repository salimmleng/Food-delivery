// Function to check if the user is logged in by checking token in localStorage
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Function to handle user logout
const handleLogout = () => {
    const token = localStorage.getItem("token");
  
    console.log(token);
  
    if (!token) {
      alert("No token found. You are not logged in.");
      return;
    }
  
    fetch("http://127.0.0.1:8000/account/logout/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("cart");  // Clear the cart during logout
        window.location.href = "index.html";
      } else {
        res.json().then(data => console.error('Error during logout:', data));
      }
    })
    .catch(error => console.error('Error during logout:', error));
};

// Function to dynamically update the dropdown menu based on login status
function updateDropdownMenu() {
    const dropdownMenu = document.getElementById('userDropdownMenu');
    dropdownMenu.innerHTML = '';  // Clear existing items

    if (isLoggedIn()) {
        // User is logged in - show Profile and Logout options
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="profile.html"><i class="fa-solid fa-user me-2"></i>Profile</a></li>
            <li><a class="dropdown-item logout-btn" href="#"><i class="fa-solid fa-sign-out-alt me-2"></i>Logout</a></li>
        `;

        // Attach the logout handler to the logout button
        document.querySelector('.logout-btn').addEventListener('click', handleLogout);
    } else {
        // User is not logged in - show Sign in option
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="register.html"><i class="fa-solid fa-sign-in-alt me-2"></i>Sign in</a></li>
        `;
    }
}

// Call the function to update the dropdown menu when the page loads
window.addEventListener('DOMContentLoaded', updateDropdownMenu);
