

// document.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const itemId = parseInt(urlParams.get('id'), 10); // Convert itemId to integer
//     console.log('Item ID:', itemId); // Log itemId
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("user_id");

//     // Fetch user orders to check their status
//     fetch(`http://127.0.0.1:8000/food/checkout/user/${userId}/`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`
//         },
//     })
//     .then(res => {
//         if (!res.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return res.json();
//     })
//     .then(ordersData => {
//         console.log('Orders Data:', ordersData); // Log orders data structure
    
//         const isDelivered = ordersData.some(order => {
//             console.log('Order Status:', order.order_status);
//             console.log('Order Items:', order.order_items);
            
//             return order.order_status === "Delivered" &&
//                    order.order_items.some(item => {
//                        console.log('Comparing Item ID:', item.food_item, 'with Item ID:', itemId);
//                        return item.food_item === itemId; // Ensure correct comparison
//                    });
//         });
    
//         console.log('Is Delivered:', isDelivered); // Log if the item is delivered
    
//         if (isDelivered) {
//             // Fetch specific item details only if it's delivered
//             fetch(`http://127.0.0.1:8000/food/food-item/${itemId}/`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Token ${token}`
//                 },
//             })
//             .then(res => {
//                 if (!res.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return res.json();
//             })
//             .then(itemData => {
//                 console.log(itemData);
//                 displayReviewItem(itemData); // Pass the item data for review display
//                 fetchAndDisplayReviews(itemId)
                
//             })
//             .catch(error => console.error('Error fetching item details:', error));
//         } else {
//             // Show message if the item is not delivered
//             const reviewItemsContainer = document.getElementById('reviewItemsContainer');
//             reviewItemsContainer.innerHTML = `<p class="text-muted text-center">You can only leave a review for delivered items.</p>`;
//         }
        
//     })
   
    
//     .catch(error => console.error('Error fetching orders:', error));
// });











// function displayReviewItem(item) {
//     console.log(item);
//     const reviewItemsContainer = document.getElementById('reviewItemsContainer');
//     reviewItemsContainer.innerHTML = ''; // Clear previous content

//     const reviewItemHTML = `
//         <div class="card mx-auto mb-4" style="max-width: 500px;">
//             <div class="card-body">
//                 <div class="review-item-form">
//                     <h6 class="text-center">Leave a Review</h6>
//                     <form id="reviewForm-${item.id}" class="review-form">
//                         <input type="hidden" name="food_item" value="${item.id}">  <!-- Change from order to food_item -->
//                         <div class="mb-3">
//                             <label for="rating-${item.id}" class="form-label">Rating</label>
//                             <select name="rating" id="rating-${item.id}" class="form-select" required>
//                                 <option value="" disabled selected>Select your rating</option>
//                                 <option value="5">⭐⭐⭐⭐⭐</option>
//                                 <option value="4">⭐⭐⭐⭐</option>
//                                 <option value="3">⭐⭐⭐</option>
//                                 <option value="2">⭐⭐</option>
//                                 <option value="1">⭐</option>
//                             </select>
//                         </div>
//                         <div class="mb-3">
//                             <label for="review_text-${item.id}" class="form-label">Your Review</label>
//                             <textarea name="review_text" id="review_text-${item.id}" class="form-control" rows="3" required></textarea>
//                         </div>
//                         <button type="submit" class="btn btn-primary w-100">Submit Review</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     `;

//     reviewItemsContainer.innerHTML = reviewItemHTML;
    
//     // Attach the review form listener
//     attachReviewFormListeners(item);
// }

// function attachReviewFormListeners(item) {
//     const form = document.getElementById(`reviewForm-${item.id}`);
//     if (form) {
//         form.addEventListener('submit', function (event) {
//             event.preventDefault();
//             submitReview(item.id);  // Pass food item ID instead of order item ID
//         });
//     }
// }

// function submitReview(foodItemId) {  // Change parameter name to foodItemId
//     const form = document.getElementById(`reviewForm-${foodItemId}`);
//     const formData = new FormData(form);
//     const token = localStorage.getItem("token");

//     // Collecting the data from the form
//     const reviewData = {
//         food_item: foodItemId,  // Change from order to food_item
//         rating: formData.get('rating'),
//         review_text: formData.get('review_text')
//     };
//     console.log(reviewData);
//     fetch("http://127.0.0.1:8000/food/reviews/create/", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`
//         },
//         body: JSON.stringify(reviewData)
//     })
//     .then(response => {
//         if (!response.ok) {
//             return response.json().then(data => {
//                 throw new Error(data.error || 'An error occurred');
//             });
//         }
//         return response.json();
//     })
//     .then(data => {
//         alert('Review submitted successfully!');  // Optional: You can uncomment this to alert the user
//         form.reset();
//     })
//     .catch(error => {
//         console.error('Error submitting review:', error);
//         alert(error.message || 'Failed to submit the review. Please try again.');
//     });
// }



// function fetchAndDisplayReviews(foodItemId) {
//     const token = localStorage.getItem("token");
    
//     fetch(`http://127.0.0.1:8000/food/reviews/?food_item_id=${foodItemId}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`
//         },
//     })
//     .then(res => {
//         if (!res.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return res.json();
//     })
//     .then(reviewsData => {
//         displayReviews(reviewsData); // Pass the reviews data for rendering
//     })
//     .catch(error => console.error('Error fetching reviews:', error));
// }


// // Function to display the reviews
// function displayReviews(reviews) {
//     console.log(reviews)
//     const reviewlistContainer = document.getElementById('reviewlistContainer');

//     // Check if there are reviews to display
//     if (reviews.length === 0) {
//         reviewlistContainer.innerHTML += `<p class="text-muted text-center">No reviews yet for this item.</p>`;
//         return;
//     }


//     const reviewsHTML = reviews.map(review => {
//         const stars = getStarRating(review.rating); // Function to generate star ratings
//         return `
//             <div class="col-md-4">
//                 <div class="review-box shadow-sm border rounded bg-light p-3">
//                     <div class="stars text-warning mb-2">${stars}</div>
//                     <p class="review-text text-secondary mb-3">"${review.review_text}"</p>
//                     <h5 class="username font-weight-bold text-dark">- ${review.username}</h5>
                    
//                 </div>
//             </div>
//         `;
//     }).join('');
    
//     function getStarRating(rating) {
//         let stars = '';
//         for (let i = 1; i <= 5; i++) {
//             stars += (i <= rating) ? '★' : '☆'; // Full star for rating and empty star for remaining
//         }
//         return stars;
//     }
    
    

//     reviewlistContainer.innerHTML += reviewsHTML; // Append reviews to the container
// }





document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'), 10);
    console.log('Item ID:', itemId); 
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
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(ordersData => {
        console.log('Orders Data:', ordersData); 
        
        // Check if the food item has been delivered
        const isDelivered = ordersData.some(order => {
            return order.order_status === "Delivered" &&
                   order.order_items.some(item => item.food_item === itemId);
        });
        
        console.log('Is Delivered:', isDelivered); 

        // Fetch specific item details
        fetch(`http://127.0.0.1:8000/food/food-item/${itemId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(itemData => {
            console.log(itemData);
            displayReviewItem(itemData, isDelivered); // Pass the item data and delivery status for review display
            fetchAndDisplayReviews(itemId);
        })
        .catch(error => console.error('Error fetching item details:', error));
    })
    .catch(error => console.error('Error fetching orders:', error));
});

function displayReviewItem(item, isDelivered) {
    console.log(item);
    const reviewItemsContainer = document.getElementById('reviewItemsContainer');
    reviewItemsContainer.innerHTML = ''; // Clear previous content

    // Create review form only if the item has been delivered
    const reviewItemHTML = `
        <div class="card mx-auto mb-4" style="max-width: 500px;">
            <div class="card-body">
                <h6 class="text-center">Leave a Review</h6>
                ${isDelivered ? `
                    <form id="reviewForm-${item.id}" class="review-form">
                        <input type="hidden" name="food_item" value="${item.id}">
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
                ` : `
                    <p class="text-muted text-center">You can only leave a review for delivered items.</p>
                `}
            </div>
        </div>
    `;

    reviewItemsContainer.innerHTML = reviewItemHTML;

    // If the item is delivered, attach the review form listener
    if (isDelivered) {
        attachReviewFormListeners(item);
    }
}

function attachReviewFormListeners(item) {
    const form = document.getElementById(`reviewForm-${item.id}`);
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            submitReview(item.id);  
        });
    }
}

function submitReview(foodItemId) {  
    const form = document.getElementById(`reviewForm-${foodItemId}`);
    const formData = new FormData(form);
    const token = localStorage.getItem("token");

    const reviewData = {
        food_item: foodItemId,  
        rating: formData.get('rating'),
        review_text: formData.get('review_text')
    };
    console.log(reviewData);
    fetch("http://127.0.0.1:8000/food/reviews/create/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'An error occurred');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Review submitted successfully!');
        form.reset();
    })
    .catch(error => {
        console.error('Error submitting review:', error);
        alert(error.message || 'Failed to submit the review. Please try again.');
    });
}

function fetchAndDisplayReviews(foodItemId) {
    const token = localStorage.getItem("token");
    
    fetch(`http://127.0.0.1:8000/food/reviews/?food_item_id=${foodItemId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(reviewsData => {
        displayReviews(reviewsData); 
    })
    .catch(error => console.error('Error fetching reviews:', error));
}

function displayReviews(reviews) {
    console.log(reviews)
    const reviewlistContainer = document.getElementById('reviewlistContainer');

    if (reviews.length === 0) {
        reviewlistContainer.innerHTML += `<p class="text-muted text-center">No reviews yet for this item.</p>`;
        return;
    }

    const reviewsHTML = reviews.map(review => {
        const stars = getStarRating(review.rating);
        return `
            <div class="col-md-4">
                <div class="review-box shadow-sm border rounded bg-light p-3">
                    <div class="stars text-warning mb-2">${stars}</div>
                    <p class="review-text text-secondary mb-3">"${review.review_text}"</p>
                    <h5 class="username font-weight-bold text-dark">- ${review.username}</h5>
                </div>
            </div>
        `;
    }).join('');

    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += (i <= rating) ? '★' : '☆'; 
        }
        return stars;
    }
    
    reviewlistContainer.innerHTML += reviewsHTML; 
}








