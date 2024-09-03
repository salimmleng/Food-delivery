
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






