

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'), 10);
    console.log('Item ID:', itemId); 
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    // Fetch user orders to check their status
    fetch(`https://fooddelivery-lyart.vercel.app/food/checkout/user/${userId}/`, {
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
        fetch(`https://fooddelivery-lyart.vercel.app/food/food-item/${itemId}/`, {
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
    const token = localStorage.getItem("token");
    const reviewItemsContainer = document.getElementById('reviewItemsContainer');
    reviewItemsContainer.innerHTML = '';

    // Create review form only if the item has been delivered
    const reviewItemHTML = `
        <div class="card mx-auto mb-4" style="max-width: 510px;">
            <div class="card-body">
              <div class="review-item-form">
                <h6 class="text-center">Leave a Review</h6>
                ${token && isDelivered ? `
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
                    <p class="text-muted text-center">You can only leave a review after receiving items.</p>
                `}
                </div>
            </div>
        </div>
    `;

    reviewItemsContainer.innerHTML = reviewItemHTML;

    // If the item is delivered, attach the review form listener
    if (token && isDelivered) {
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
    fetch("https://fooddelivery-lyart.vercel.app/food/reviews/create/", {
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
    fetch(`https://fooddelivery-lyart.vercel.app/food/reviews/?food_item_id=${foodItemId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
           
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

     // Check if the header already exists or not
     if (!document.getElementById('reviews-header')) {
        const headerHTML = `
            <h4 id="reviews-header" class="text-center" style="font-size: 26px; font-weight: 600; color: #333; letter-spacing: 1px; padding: 10px; background-color: rgba(255, 255, 255, 0.8); border-radius: 5px;">
                Customer Reviews on Our Food
            </h4>
        `;
        reviewlistContainer.innerHTML += headerHTML;
    }

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








