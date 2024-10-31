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


// function submitOrder(event) {
//     event.preventDefault();

//     const fullName = document.getElementById('fullName').value;
//     const email = document.getElementById('email').value;
//     const address = document.getElementById('address').value;
//     const city = document.getElementById('city').value;
//     const totalAmount = parseFloat(document.querySelector('.checkoutSubtotal-value').textContent);

//     // Map cart items to backend-friendly format
//     const orderItems = cart.map(item => ({
//         food_item: item.id,
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price
//     }));

//     // Step 1:  order first
//     fetch('https://fooddelivery-lyart.vercel.app/food/checkout/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//             full_name: fullName,
//             email: email,
//             address: address,
//             city: city,
//             order_items: orderItems,
//             total_price: totalAmount,
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Check if the order was placed successfully
//         if (data.success) {
//             // Step 2: payment create
//             fetch('https://fooddelivery-lyart.vercel.app/food/payment/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Token ${localStorage.getItem('token')}`,
//                     'X-CSRFToken': getCSRFToken(),
//                 },
//                 body: JSON.stringify({
//                     order_id: data.order_id, 
//                     total_price: totalAmount,
//                     full_name: fullName,
//                     email: email,
//                     phone: data.phone || "01700000000",  
//                     address: address,
//                     city: city
//                 })
//             })
//             .then(paymentResponse => paymentResponse.json())
//             .then(paymentData => {
               
//                 console.log(paymentData)
//                 if (paymentData.GatewayPageURL) {
//                     // Redirect to the payment gateway
//                     window.location.href = paymentData.GatewayPageURL;
//                     // localStorage.removeItem("cart");
//                 } else {
//                     alert(`Payment session creation failed: ${paymentData.error}`);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error during payment session creation:', error);
//                 alert("An error occurred during the payment process.");
//             });
//         } else {
//             alert('Order could not be placed. Please try again.');
//         }
//     })
//     .catch(error => {
//         console.error('Error placing the order:', error);
//         alert("An error occurred while placing your order.");
//     });
// }





// Function to submit the order and initiate payment
function submitOrder(event) {
    event.preventDefault();
    const userId = localStorage.getItem('user_id');
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const totalAmount = parseFloat(document.querySelector('.checkoutSubtotal-value').textContent);

    const orderItems = cart.map(item => ({
        food_item: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));

    // Step 1: Initiate payment session
    fetch('https://fooddelivery-lyart.vercel.app/food/payment/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
            // 'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
            user_id: userId,
            total_price: totalAmount,
            full_name: fullName,
            email: email,
            address: address,
            city: city,
            order_items: orderItems
        })
    })
    .then(paymentResponse => paymentResponse.json())
    .then(paymentData => {
        console.log(paymentData.order_data.transaction_id)
        if (paymentData.GatewayPageURL) {
            // Save order data in local storage for later confirmation
            localStorage.setItem("paymentData", JSON.stringify({
                full_name: fullName,
                email: email,
                address: address,
                city: city,
                order_items: orderItems,
                total_price: totalAmount,
                transaction_id: paymentData.order_data.transaction_id,
            }));
            window.location.href = paymentData.GatewayPageURL;
        } else {
            alert(`Payment session creation failed: ${paymentData.error}`);
        }
    })
    .catch(error => {
        console.error('Error during payment session creation:', error);
        alert("An error occurred during the payment process.");
    });
}




// Function to confirm the order after successful payment
function confirmOrderAfterPayment(event) {
    event.preventDefault();
    const paymentData = JSON.parse(localStorage.getItem("paymentData"));

    if (!paymentData) {
        console.error("Payment data not found. Please try again.");
        return;
    }

    // Check if the payment was successful (this would typically be a backend verification)
    fetch('https://fooddelivery-lyart.vercel.app/food/payment/success/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            transaction_id: paymentData.transaction_id
        })
    })
    .then(successResponse => successResponse.json())
    .then(successData => {
        if (successData.success) {
            // Step 3: Place the order after successful payment verification
            fetch('https://fooddelivery-lyart.vercel.app/food/checkout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(paymentData)
            })
            .then(response => response.json())
            .then(orderData => {
                if (orderData.success) {
                    alert("Order successfully placed!");
                    localStorage.removeItem("paymentData");
                    localStorage.removeItem("cart");
                } else {
                    alert("Order could not be placed. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error placing the order:', error);
                alert("An error occurred while placing your order.");
            });
        } else {
            alert("Payment confirmation failed. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error confirming payment:', error);
        alert("An error occurred during payment confirmation.");
    });
}

