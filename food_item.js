
document.addEventListener("DOMContentLoaded", function() {
    showCategory('all');
});

function showCategory(categoryName) {
    // Hide all category sections
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => section.style.display = 'none');

    // Show the selected category section
    const selectedSection = document.getElementById(categoryName);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Fetch and display food items for the selected category
    fetch(`http://127.0.0.1:8000/food/food-items/${categoryName}/`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById(`${categoryName}-items-container`);
            if (!container) {
                console.error(`Container with ID ${categoryName}-items-container not found`);
                return;
            }
            container.innerHTML = ''; // Clear existing items

            if (data.length === 0) {
                container.innerHTML = '<p>No items found.</p>';
            } else {
                data.forEach(item => {
                    console.log(); // Check if the image URL is correct
                    const foodCard = `
                         <div class="col-md-4">
                    <div class="card food-card mb-4">
                        <div class="img-wrapper">
                            <img src="http://127.0.0.1:8000/${item.image}" class="card-img-top" alt="Pizza">
                            <div class="icons-wrapper">
                                <div class="icon-container">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    <span class="icon-text">Add to Cart</span>
                                </div>
                                <div class="icon-container">
                                    <i class="fa-solid fa-eye" onclick="openModal(${item.id})"></i>
                                    <span class="icon-text">Quick View</span>
                                </div>
                                <div class="icon-container">
                                    <i class="fa-solid fa-heart"></i>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <span class="price">$${item.price}</span><br>
                        </div>
                    </div>
                </div>`
                    container.innerHTML += foodCard;
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}


// modal task


function openModal(itemId) {
    fetch(`http://127.0.0.1:8000/food/food-item/${itemId}/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('modalFoodImage').src = `http://127.0.0.1:8000/${data.image}`;
            document.getElementById('modalFoodName').textContent = data.name;
            document.getElementById('modalFoodDescription').textContent = data.description;
            document.getElementById('modalFoodPrice').textContent = `$${data.price}`;
            
            // Show the modal
            var foodItemModal = new bootstrap.Modal(document.getElementById('foodItemModal'));
            foodItemModal.show();
        })
        .catch(error => console.error('Error fetching item data:', error));
}



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
    updateSubtotal()
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
                <span>${item.name}</span>
                <div>
                    <span class="item-price">$${item.price}</span>
                    <input type="number" class="item-quantity" value="1" min="1" style="width: 50px; margin-left: 10px;">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
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
    updateSubtotal()
}

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

// Initial update of cart quantity on page load
updateCartQuantity();



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



