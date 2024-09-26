
// Function to dynamically update the dropdown menu based on login status
function updateDropdownMenu() {
  const dropdownMenu = document.getElementById('userDropdownMenu');
  // const reg = document.getElementById('register');
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
      // reg.innerHTML = `
      // <a id="register" href="">Register</a>
      // `
  }
}

// Ensure isLoggedIn is properly defined
function isLoggedIn() {
  // This is a placeholder - replace with actual login check logic
  return !!localStorage.getItem('token'); // Example using token stored in localStorage
}

// Handle user logout
function handleLogout() {
  // Example logic for logging out the user
  localStorage.removeItem('token');
  localStorage.removeItem("user_id");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
  updateDropdownMenu();  // Update the dropdown menu after logout
  alert('You have been logged out.');
}


// Call the function to update the dropdown menu when the page loads
window.addEventListener('DOMContentLoaded', updateDropdownMenu);
