document.addEventListener('DOMContentLoaded', function() {
    fetchProfileData();
  });

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  function fetchProfileData() {

    fetch(`https://foodapi-flame.vercel.app/account/profile/${userId}/`, {
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
        document.getElementById('profile-name').textContent = data.username;
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
  