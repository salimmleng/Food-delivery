document.addEventListener('DOMContentLoaded', function() {
    fetchProfileData();
  });

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  function fetchProfileData() {

    fetch(`http://127.0.0.1:8000/account/profile/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {

      if (data) {
        // Update the profile name and email dynamically
        const fullName = `${data.first_name} ${data.last_name}`;
        document.getElementById('profile-name').textContent = fullName;
        document.getElementById('profile-email').textContent = data.email;
        document.getElementById('nm').innerHTML = data.username;
        document.getElementById('em').innerHTML = data.email;
      } else {
        alert('Failed to load profile data.');
      }
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    });
  }
  