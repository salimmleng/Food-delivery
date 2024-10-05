
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
    fetch(`https://fooddelivery-lyart.vercel.app/food/food-items/${categoryName}/`)
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
                    console.log(); 
                    const foodCard = `
                         <div class="col-lg-4 col-md-4 col-sm-6 col-12">
                    <div class="card food-card mb-4">
                        <div class="img-wrapper">
                            <img src="${item.image}" class="card-img-top" alt="Pizza">
                            <div class="icons-wrapper">
                                <div class="icon-container">
                                    <i class="fa-solid fa-cart-shopping" onclick="viewDetails(${item.id})"></i>
                                    <span class="icon-text">Add to Cart</span>
                                </div>
                                <div class="icon-container">
                                    <i class="fa-solid fa-eye" onclick="viewDetails(${item.id})"></i>
                                    <span class="icon-text">View details</span>
                                </div>
                                <div class="icon-container">
                                    <i class="fa-solid fa-heart" onclick="this.style.color = this.style.color === 'red' ? '' : 'red'"></i>

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

function viewDetails(itemId) {
    window.location.href = `menu_detail.html?id=${itemId}`;
}






let cart = [];
function toggleCartSidebar() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

// Function to update cart quantity display
function updateCartQuantity() {
    document.querySelector('.totalQuantity').textContent = cart.length;
}

// Function to add item to cart
function addToCart(item) {
    console.log(item)
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        item.quantity = 1; // Set quantity to 1 for new items
        cart.push(item);
    }
    
    updateCartQuantity();
    renderCartItems();
    updateSubtotal();
    saveCartToLocalStorage(); // Save cart to localStorage
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; 

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
         console.log(item)
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


//  Function to update item quantity
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


// Function to save the cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));

}

// Function to load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartQuantity();
        renderCartItems();    // to retain cart in the cart items
        
       
    }
}


// Function to get query parameters from URL
function getQueryParams(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch menu details and display them
const getMenuDetail = () => {
    const menuId = getQueryParams("id");
    const token = localStorage.getItem("token");

    fetch(`https://fooddelivery-lyart.vercel.app/food/food-item/${menuId}/`, {
        method: "GET",
    })
        .then((res) => res.json())
        .then((menu) => {
            console.log(menu)
            console.log(menu.id)

            const menuDetailContainer = document.getElementById("menu_detail-container");
            const div = document.createElement("div");
            div.classList.add("row", "container", "whole-part", "d-flex", "align-items-center", "m-auto");

            let buttonHTML = "";
            if (token) {
                buttonHTML = `
                    <button
                        type="button"
                        id="addToCartButton"
                        class="btn btn-add-to-cart font-weight-bold px-4 py-2 mt-4"
                    >
                        Add to Cart
                    </button>
                `;
            } else {
                buttonHTML = `
                    <p class="mt-4">
                        <a class="text-decoration-none btn btn-add-to-cart" href="./register.html">Add to Cart</a>
                    </p>
                `;
            }

            div.innerHTML = `
                <div class="col-md-6 d-flex justify-content-center">
                    <img class="detail-img img-fluid image-hover" src="${menu.image}" alt="${menu.name} Image">
                </div>
                <div class="col-md-6">
                    <div class="detail-right p-4">
                        
                        <ul class="list-unstyled">
                            <li class="mb-3 d-flex align-items-center">
                                <h6 class="text-dark card-title m-0">${menu.name}</h6>
                            </li>
                            <li class="mb-3 d-flex align-items-center">
                                <h6 class="m-0">${menu.description}</h6>
                            </li>
                            <li class="mb-4 d-flex align-items-center">
                                <h6 class="text-dark m-0"><strong>Price:</strong> $${menu.price}</h6>
                            </li>
                        </ul>
                        ${buttonHTML}
                    </div>
                </div>
            `;
  
            menuDetailContainer.appendChild(div);

            // Add event listener for "Add to Cart" button after the menu is displayed
            if (token) {
                document.getElementById('addToCartButton').addEventListener('click', function() {
                    const item = {
                        id: menu.id,
                        name: menu.name,
                        price: parseFloat(menu.price), // Get the price from the fetched data
                        image: menu.image
                    };
                    console.log(item)
                    addToCart(item); // Add item to cart
                });
            }
        });
};

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function() {
    getMenuDetail(); // Fetch and display the menu details
    loadCartFromLocalStorage(); // Load the cart from localStorage when the page loads
   
});

document.querySelector('.icon-cart').addEventListener('click', toggleCartSidebar);





function toggleLove(icon) {
    icon.classList.toggle('red-heart');
}

