

document.addEventListener('DOMContentLoaded', function() {
  fetchProfileData();

  const editButton = document.getElementById('edit-profile');
  const saveButton = document.getElementById('save-profile');
  const cancelButton = document.getElementById('cancel-edit');

  editButton.addEventListener('click', function() {
      document.getElementById('profile-view').style.display = 'none';
      document.getElementById('edit-mode').style.display = 'block';
      document.getElementById('edit-username').value = document.getElementById('profile-username').textContent;
      document.getElementById('edit-fullname').value = document.getElementById('profile-name').textContent;
      document.getElementById('edit-email').value = document.getElementById('profile-email').textContent;
  });

  saveButton.addEventListener('click', function() {
      updateProfile();
  });

  cancelButton.addEventListener('click', function() {
      document.getElementById('profile-view').style.display = 'block';
      document.getElementById('edit-mode').style.display = 'none';
  });
});

const userId = localStorage.getItem('user_id');
const token = localStorage.getItem('token');

function fetchProfileData() {
  fetch(`https://fooddelivery-lyart.vercel.app/account/profile/${userId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      // Update the profile with dynamic data
      document.getElementById('profile-username').textContent = data.username;
      document.getElementById('profile-name').textContent = `${data.first_name} ${data.last_name}`;
      document.getElementById('profile-email').textContent = data.email;
    } else {
      alert('Failed to load profile data.');
    }
  })
  .catch(error => {
    console.error('Error fetching profile data:', error);
  });
}

function updateProfile() {
  const username = document.getElementById('edit-username').value;
  const fullname = document.getElementById('edit-fullname').value;
  const email = document.getElementById('edit-email').value;
  
  const [firstName, lastName] = fullname.split(' '); // Simple split to get first and last name

  fetch(`https://fooddelivery-lyart.vercel.app/account/profile/${userId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      // Update the profile view with the new data
      document.getElementById('profile-username').textContent = data.username;
      document.getElementById('profile-name').textContent = `${data.first_name} ${data.last_name}`;
      document.getElementById('profile-email').textContent = data.email;
      
      // Switch back to view mode
      document.getElementById('profile-view').style.display = 'block';
      document.getElementById('edit-mode').style.display = 'none';
    } else {
      alert('Failed to update profile.');
    }
  })
  .catch(error => {
    console.error('Error updating profile:', error);
  });
}
