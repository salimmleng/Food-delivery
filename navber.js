// Function to check user role and redirect to the appropriate page
function redirectToProfilePage() {
  const userRole = localStorage.getItem('user_role'); // Fetch user role from localStorage

  if (userRole === 'admin') {
      // Redirect to admin profile page
      window.location.href = 'admin_profile.html';
  } else if (userRole === 'customer') {
      // Redirect to customer profile page
      window.location.href = 'profile.html';
  }
}

// Function to dynamically update the dropdown menu based on login status
function updateDropdownMenu() {
  const dropdownMenu = document.getElementById('userDropdownMenu');
  dropdownMenu.innerHTML = '';  // Clear existing items

  if (isLoggedIn()) {
      // User is logged in - show Profile and Logout options
      dropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="javascript:void(0)" onclick="redirectToProfilePage()"><i class="fa-solid fa-user me-2"></i>Profile</a></li>
         
      `;
  } else {
      // User is not logged in - show Sign in option
      dropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="register.html"><i class="fa-solid fa-sign-in-alt me-2"></i>Sign in</a></li>
      `;
  }
}

// Function to check if user is logged in
function isLoggedIn() {
  // Replace with actual logic to check if user is logged in, e.g., checking a token in localStorage
  return !!localStorage.getItem('token');
}

// Call the function to update the dropdown menu when the page loads
window.addEventListener('DOMContentLoaded', updateDropdownMenu);

