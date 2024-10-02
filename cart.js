let cart = [];

// Function to toggle the cart sidebar
function toggleCartSidebar() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

// Function to update cart quantity display
function updateCartQuantity() {
    document.querySelector('.totalQuantity').textContent = cart.length;
}

// Function to add item to cart
function addToCart(item) {
    // Check if the item is already in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex !== -1) {
        // If the item already exists in the cart, increase the quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If the item is new, set quantity to 1
        item.quantity = 1;
        cart.push(item);
    }
    
    updateCartQuantity();
    renderCartItems();
    updateSubtotal();
    saveCartToLocalStorage(); // Save cart to localStorage
}

// Function to render cart items in the sidebar
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span class="cart-font">${item.name}</span>
                <div>
                    <span class="item-price text-white">$${item.price}</span>
                    <input type="number" class="item-quantity" value="${item.quantity}" min="1" style="width: 45px; height: 25px; margin-left: 10px;" onchange="updateItemQuantity(${index}, this.value)">
                    <i onclick="removeFromCart(${index})" class="fa-regular fa-trash-can mx-2"></i>
                </div>
            </div>
            <hr class="text-white">
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    updateSubtotal(); 
}

// Function to update item quantity
function updateItemQuantity(index, newQuantity) {
    cart[index].quantity = parseInt(newQuantity);
    updateSubtotal();
    saveCartToLocalStorage(); // Save cart to localStorage after updating quantity
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartQuantity();
    renderCartItems();
    updateSubtotal();
    saveCartToLocalStorage(); 
}


function updateSubtotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    document.querySelector('.subtotal-value').textContent = `$${subtotal.toFixed(2)}`;
}


function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartQuantity();
        renderCartItems();
        updateSubtotal();
    }
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    updateCartQuantity();
});

// Event listener for the Add to Cart button
document.querySelector('.btn-add-to-cart').addEventListener('click', function() {
    const token = localStorage.getItem("token");
    if (token) {
        const item = {
            name: document.getElementById('modalFoodName').textContent,
            price: parseFloat(document.getElementById('modalFoodPrice').textContent.slice(1)), // Remove the '$' sign
            image: document.getElementById('modalFoodImage').src
        };

        addToCart(item);
    } else {
        window.location.href = 'register.html';
    }
});


document.querySelector('.icon-cart').addEventListener('click', toggleCartSidebar);


