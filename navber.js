
function redirectToProfilePage() {
  const userRole = localStorage.getItem('user_role'); 

  if (userRole === 'admin') {
      
      window.location.href = 'admin_profile.html';
  } else if (userRole === 'customer') {
      
      window.location.href = 'profile.html';
  }
}

// Function to dynamically update the dropdown menu based on login status
function updateDropdownMenu() {
  const dropdownMenu = document.getElementById('userDropdownMenu');
  dropdownMenu.innerHTML = '';  

  if (isLoggedIn()) {
      
      dropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="javascript:void(0)" onclick="redirectToProfilePage()"><i class="fa-solid fa-user me-2"></i>Profile</a></li>
         
      `;
  } else {
      
      dropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="register.html"><i class="fa-solid fa-sign-in-alt me-2"></i>Sign in</a></li>
      `;
  }
}


function isLoggedIn() {
  
  return !!localStorage.getItem('token');
}


window.addEventListener('DOMContentLoaded', updateDropdownMenu);

