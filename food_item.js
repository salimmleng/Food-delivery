// function showCategory(category) {
//     // Hide all categories
//     var categories = document.getElementsByClassName('category-section');
//     for (var i = 0; i < categories.length; i++) {
//         categories[i].style.display = 'none';
//     }

//     // Show the selected category or all categories
//     if (category === 'all') {
//         document.getElementById('all').style.display = 'block';
//     } else {
//         document.getElementById(category).style.display = 'block';
//     }
// }


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
                    console.log(item.image); // Check if the image URL is correct
                    const foodCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card food-card">
                                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.description}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="price">$${item.price}</span>
                                        <button class="btn btn-primary">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    container.innerHTML += foodCard;
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}







