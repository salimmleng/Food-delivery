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



function submitOrder() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const tprice = parseInt(document.getElementById('tprice').innerText);

    // Validate cart 
    if (cart.length === 0) {
        alert("Your cart is empty. Add items to proceed.");
        return;
    }
   

    const orderItems = cart.map(item => ({
        food_item: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
    console.log(orderItems)
    console.log(cart)

    console.log({
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

    // Send order data to the backend
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
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
            order_items: orderItems,
            total_price: tprice,
        })
    })  

        .then(response => {
            // Check the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json(); // Parse JSON if response is JSON
            } else {
                throw new Error("Response is not JSON. HTML might have been returned.");
            }
        })
        .then(data => {
            if (data.success) {
                const alertModal = new bootstrap.Modal(document.getElementById("orderAlertModal"));
                alertModal.show();
                localStorage.setItem('order_id', data.order_id);
                localStorage.removeItem('cart');
            } else {
                console.error('Error placing order:', data);
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
        });
}

