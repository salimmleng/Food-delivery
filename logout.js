const handleLogout = () => {
    const token = localStorage.getItem("token");
  
    console.log(token)
  
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
        localStorage.removeItem("cart");
        window.location.href = "index.html";
      } else {
        res.json().then(data => console.error('Error during logout:', data));
      }
    })
    .catch(error => console.error('Error during logout:', error));
  };
  
  
  document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.dropdown-menu .dropdown-item[href="#"]');
    
    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }
  });
  