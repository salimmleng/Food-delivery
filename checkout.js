let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render cart items in the summary
function renderCartItems() {
    const cartItemsContainer = document.getElementById('checkoutcartItems');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>No items in the cart.</p>';
        document.querySelector('.checkoutSubtotal-value').textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span class="title-font">${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span> <!-- Show total price for the item -->
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}


// Function to update the subtotal value
function updateSubtotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseFloat(item.price) * item.quantity; // Multiply by quantity
    });
    document.querySelector('.checkoutSubtotal-value').textContent = `$${subtotal.toFixed(2)}`;
}


// Function to handle order submission
function submitOrder() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    // Validate cart before proceeding
    if (cart.length === 0) {
        alert("Your cart is empty. Add items to proceed.");
        return;
    }

    // Send order data to the backend
    fetch('http://127.0.0.1:8000/food/checkout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify({
            full_name: fullName,
            email: email,
            address: address,
            city: city,
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
            cart_items: cart
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart'); // Clear cart
            // Redirect to a success page, for example:
            // window.location.href = 'thank_you.html';
        } else {
            console.error('Error placing order:', data.message);
            alert('Error placing order: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Initial rendering of the cart items and subtotal
renderCartItems();
updateSubtotal();
