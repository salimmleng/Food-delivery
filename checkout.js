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
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}
function updateSubtotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseFloat(item.price) * item.quantity; // Multiply by quantity
    });
    document.querySelector('.checkoutSubtotal-value').textContent = `${subtotal.toFixed(2)}`;
}


// Function to update the subtotal value
function submitOrder() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const tprice = parseInt(document.getElementById('tprice').innerText);

    // Validate cart before proceeding
    if (cart.length === 0) {
        alert("Your cart is empty. Add items to proceed.");
        return;
    }
    console.log({
        full_name: fullName,
        email: email,
        address: address,
        city: city,
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv: cvv,
        order_items: cart,
        total_price: tprice,


    })

    const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
    console.log(orderItems)
    console.log(cart)

    // Send order data to the backend
    fetch('https://foodapi-flame.vercel.app/food/checkout/', {
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
            order_items: orderItems,
            total_price: tprice,
        })
    })  

        .then(response => {
            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json(); // Parse JSON if response is JSON
            } else {
                throw new Error("Response is not JSON. HTML might have been returned.");
            }
        })
        .then(data => {
            if (data.success) {
                alert('Order placed successfully!');
                localStorage.setItem('order_id', data.order_id);
                localStorage.removeItem('cart');
                // Redirect to a success page
                // window.location.href = 'checkout.html';
            } else {
                console.error('Error placing order:', data);
                // alert('Error placing order: ' + JSON.stringify(data));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // alert('Error: ' + error.message);  // Display the error message
        });
}
// Initial rendering of the cart items and subtotal
renderCartItems();
updateSubtotal();
