// document.addEventListener('DOMContentLoaded', () => {
//     loadTestimonials();
// });

// const loadTestimonials = () => {
//     const url = 'http://127.0.0.1:8000/food/reviews/create/';
//     const token = localStorage.getItem("token");  // Assuming you're using token for authentication

//     fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`  // Include authorization header if required
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         const testimonialContainer = document.getElementById('testimonial-container');

//         // Clear previous content
//         testimonialContainer.innerHTML = '';

//         // Loop through the reviews and create testimonial boxes
//         data.forEach(review => {
//             const col = document.createElement('div');
//             col.className = 'col-md-4';
//             const stars = getStarRating(review.rating);
//             col.innerHTML = `
//             <div class="testimonial-box shadow-sm border rounded bg-light">
//                 <div class="stars text-warning mb-2">${stars}</div>
//                 <p class="review-text text-secondary mb-3">"${review.review_text}"</p>
//                 <h5 class="username font-weight-bold text-dark">- ${review.username}</h5>
//             </div>
//            `;

//             // Append the testimonial to the container
//             testimonialContainer.appendChild(col);
//         });
//     })
//     .catch(error => console.error('Error fetching reviews:', error));
// };

// function getStarRating(rating) {
//     let stars = '';
//     for (let i = 1; i <= 5; i++) {
//         if (i <= rating) {
//             stars += '★';  // Full star for the rating
//         } else {
//             stars += '☆';  // Empty star for the remaining
//         }
//     }
//     return stars;
// }



// old

// document.addEventListener('DOMContentLoaded', () => {
    
//     const orderItems = JSON.parse(localStorage.getItem('orderItems')) || []; // Get order items from local storage

//     // Fetch user orders to check their status
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("user_id");
    
//     fetch(`http://127.0.0.1:8000/food/checkout/user/${userId}/`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`
//         },
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         console.log(data)
//         const orderItems = []; // Initialize an array to store all order items
//         const deliveredItems = []; 
        
//         data.forEach((order) => {

//             // Check if the order is delivered
//             if (order.order_status === "Delivered") {
//                 order.order_items.forEach((item) => {
//                     console.log(item)
//                     orderItems.push(item)
//                     // Add item id to the deliveredItems array
//                     deliveredItems.push(item.id);
//                 });
//             }
//         });

//         // Filter order items to only show those that are delivered
//         displayReviewItems(orderItems.filter(item => deliveredItems.includes(item.id)), "delivered");
//     })
//     .catch((error) => console.error('Error fetching order:', error));
// });

// function displayReviewItems(items, orderStatus) {
//     console.log(items);
//     console.log(orderStatus);
//     const reviewItemsContainer = document.getElementById('reviewItemsContainer');
//     reviewItemsContainer.innerHTML = ''; // Clear previous content

//     if (orderStatus === 'delivered') {
//         // Only show review items if the order status is delivered
//         items.forEach(item => {
//             const reviewItemHTML = `
//                 <div class="card mx-auto mb-4" style="max-width: 500px;">
//                     <div class="card-body">
//                         <h5 class="card-title text-center">${item.name}</h5>
//                         <p class="card-text text-center item-price">Price: $${item.price}</p>
//                         <div class="review-item-form">
//                             <h6 class="text-center">Leave a Review</h6>
//                             <form id="reviewForm-${item.id}" class="review-form">
//                                 <input type="hidden" name="order_item" value="${item.id}">
//                                 <div class="mb-3">
//                                     <label for="rating-${item.id}" class="form-label">Rating</label>
//                                     <select name="rating" id="rating-${item.id}" class="form-select" required>
//                                         <option value="" disabled selected>Select your rating</option>
//                                         <option value="5">⭐⭐⭐⭐⭐</option>
//                                         <option value="4">⭐⭐⭐⭐</option>
//                                         <option value="3">⭐⭐⭐</option>
//                                         <option value="2">⭐⭐</option>
//                                         <option value="1">⭐</option>
//                                     </select>
//                                 </div>
//                                 <div class="mb-3">
//                                     <label for="review_text-${item.id}" class="form-label">Your Review</label>
//                                     <textarea name="review_text" id="review_text-${item.id}" class="form-control" rows="3" required></textarea>
//                                 </div>
//                                 <button type="submit" class="btn btn-primary w-100">Submit Review</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             `;
//             reviewItemsContainer.innerHTML += reviewItemHTML;
//         });
//     } else {
//         // If order status is not delivered, show a message
//         reviewItemsContainer.innerHTML = `<p class="text-muted text-center">Reviews are only available for delivered items.</p>`;
//     }

//     // Attach event listeners to review forms only if items were displayed
//     if (orderStatus === 'delivered') {
//         attachReviewFormListeners(items);
//     }
// }



// function attachReviewFormListeners(items) {
//     items.forEach(item => {
//         const form = document.getElementById(`reviewForm-${item.id}`);
//         if (form) {
//             form.addEventListener('submit', function (event) {
//                 event.preventDefault();
//                 submitReview(item.id);
//             });
//         }
//     });
// }

// new

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id'); // Assuming the URL is something like '/item.html?id=1'
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    // Fetch user orders to check their status
    fetch(`http://127.0.0.1:8000/food/checkout/user/${userId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
    })
    .then((res) => res.json())
    .then((ordersData) => {
        // Check if the item has been delivered
        const deliveredItems = ordersData
            .filter(order => order.order_status === "Delivered")
            .flatMap(order => order.order_items.map(item => item.id));

        if (deliveredItems.includes(Number(itemId))) {
            // Fetch specific item details only if it's delivered
            fetch(`http://127.0.0.1:8000/food/food-item/${itemId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
            })
            .then(res => res.json())
            .then(itemData => {
                displayReviewItem(itemData); // Pass the item data for review display
            })
            .catch(error => console.error('Error fetching item details:', error));
        } else {
            // Show message if the item is not delivered
            const reviewItemsContainer = document.getElementById('reviewItemsContainer');
            reviewItemsContainer.innerHTML = `<p class="text-muted text-center">You can only leave a review for delivered items.</p>`;
        }
    })
    .catch(error => console.error('Error fetching orders:', error));
});

function displayReviewItem(item) {
    const reviewItemsContainer = document.getElementById('reviewItemsContainer');
    reviewItemsContainer.innerHTML = ''; // Clear previous content

    // Assuming item object has a structure similar to: { id, name, price }
    const reviewItemHTML = `
        <div class="card mx-auto mb-4" style="max-width: 500px;">
            <div class="card-body">
                
                <div class="review-item-form">
                    <h6 class="text-center">Leave a Review</h6>
                    <form id="reviewForm-${item.id}" class="review-form">
                        <input type="hidden" name="order_item" value="${item.id}">
                        <div class="mb-3">
                            <label for="rating-${item.id}" class="form-label">Rating</label>
                            <select name="rating" id="rating-${item.id}" class="form-select" required>
                                <option value="" disabled selected>Select your rating</option>
                                <option value="5">⭐⭐⭐⭐⭐</option>
                                <option value="4">⭐⭐⭐⭐</option>
                                <option value="3">⭐⭐⭐</option>
                                <option value="2">⭐⭐</option>
                                <option value="1">⭐</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="review_text-${item.id}" class="form-label">Your Review</label>
                            <textarea name="review_text" id="review_text-${item.id}" class="form-control" rows="3" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Submit Review</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    reviewItemsContainer.innerHTML = reviewItemHTML;
    
    // Attach the review form listener
    attachReviewFormListeners([item]);
}

function attachReviewFormListeners(items) {
    const item = items[0]; // Assuming only one item is passed
    const form = document.getElementById(`reviewForm-${item.id}`);
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            submitReview(item.id);
        });
    }
}




function submitReview(orderItemId) {
    const form = document.getElementById(`reviewForm-${orderItemId}`);
    const formData = new FormData(form);
    const token = localStorage.getItem("token");

    const reviewData = {
        order_item: formData.get('order_item'),
        rating: formData.get('rating'),
        review_text: formData.get('review_text')
    };

    fetch('http://127.0.0.1:8000/food/reviews/create/', {  // Replace with your actual API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}` 
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Review submitted successfully!');
            form.reset();
        } else {
            alert('Error submitting review: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error submitting review:', error);
    });
}

