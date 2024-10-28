let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render cart items in the summary
function renderCartItems() {
    const cartItemsContainer = document.getElementById('checkoutcartItems');
    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>No items in the cart.</p>';
        document.querySelector('.checkoutSubtotal-value').textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        console.log(item.id)
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
        subtotal += parseFloat(item.price) * item.quantity;
    });
    document.querySelector('.checkoutSubtotal-value').textContent = `${subtotal.toFixed(2)}`;
}

renderCartItems();
updateSubtotal();



function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const c = cookie.trim();
        if (c.startsWith(name + '=')) {
            return c.substring(name.length + 1);
        }
    }
    return null;
}


function submitOrder(event) {
    event.preventDefault(); // Prevent default form submission

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const totalAmount = parseFloat(document.querySelector('.checkoutSubtotal-value').textContent);

    // Map cart items to backend-friendly format
    const orderItems = cart.map(item => ({
        food_item: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));

    fetch('https://fooddelivery-lyart.vercel.app/food/checkout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            full_name: fullName,
            email: email,
            address: address,
            city: city,
            order_items: orderItems,
            total_price: totalAmount,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.GatewayPageURL) {
            window.location.href = data.GatewayPageURL;
        } else if (data.success) {
           
            fetch('https://fooddelivery-lyart.vercel.app/food/payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    order_id: data.order_id,
                    total_price: totalAmount,
                    full_name: fullName,
                    email: email,
                    phone: data.phone || "01700000000",  // Adjust as needed
                    address: address,
                    city: city
                })
            })
            .then(response => response.json())
            .then(paymentData => {
                if (paymentData.GatewayPageURL) {
                    // Redirect to the payment gateway
                    window.location.href = paymentData.GatewayPageURL;
                    localStorage.removeItem("cart");
                } else {
                    alert(`Payment session creation failed: ${paymentData.error}`);
                }
            })
            .catch(error => {
                console.error('Error during payment session creation:', error);
            });
        } else {
            alert('Order placed successfully, but payment session could not be created.');
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        // alert("An error occurred during payment.");
    });
}
