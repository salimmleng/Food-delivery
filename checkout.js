// cart side

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
    cart.push(item);
    updateCartQuantity();
    renderCartItems();
    updateSubtotal();
    saveCartToLocalStorage(); // Save cart to localStorage
}

// Function to render cart items in the sidebar
function renderCartItems() {
    const cartItemsContainer = document.getElementById('checkoutItems');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span class="cart-font">${item.name}</span>
                <div>
                    <span class="item-price">$${item.price}</span>
                    <input type="number" class="item-quantity" value="1" min="1" style="width: 45px; height: 25px; margin-left: 10px;" onchange="updateSubtotal()">
                    <i onclick="removeFromCart(${index})" class="fa-regular fa-trash-can mx-2"></i>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    updateSubtotal(); // Update subtotal after rendering items
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartQuantity();
    renderCartItems();
    updateSubtotal();
    saveCartToLocalStorage(); // Save cart to localStorage
}

// Function to update the subtotal
function updateSubtotal() {
    let subtotal = 0;
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.item-quantity').value);
        subtotal += price * quantity;
    });

    document.querySelector('.subtotal-value').textContent = `$${subtotal.toFixed(2)}`;
}

// Function to save cart to localStorage
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
    const item = {
        name: document.getElementById('modalFoodName').textContent,
        price: document.getElementById('modalFoodPrice').textContent.slice(1), // Remove the '$' sign
        image: document.getElementById('modalFoodImage').src
    };

    addToCart(item);
});

// Event listener for the cart icon to open the cart sidebar
document.querySelector('.icon-cart').addEventListener('click', toggleCartSidebar);

