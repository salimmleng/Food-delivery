document.addEventListener('DOMContentLoaded', function() {
    fetch('cart_sideber.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('cartSidebarContainer').innerHTML = data;
        })
        .catch(error => console.error('Error loading cart sidebar:', error));
});


