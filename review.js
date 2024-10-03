document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
});

const loadTestimonials = () => {
    const url = 'http://127.0.0.1:8000/food/reviews/create/';
    const token = localStorage.getItem("token");  // Assuming you're using token for authentication

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`  // Include authorization header if required
        }
    })
    .then(response => response.json())
    .then(data => {
        const testimonialContainer = document.getElementById('testimonial-container');

        // Clear previous content
        testimonialContainer.innerHTML = '';

        // Loop through the reviews and create testimonial boxes
        data.forEach(review => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            const stars = getStarRating(review.rating);
            col.innerHTML = `
            <div class="testimonial-box shadow-sm border rounded bg-light">
                <div class="stars text-warning mb-2">${stars}</div>
                <p class="review-text text-secondary mb-3">"${review.review_text}"</p>
                <h5 class="username font-weight-bold text-dark">- ${review.username}</h5>
            </div>
           `;

            // Append the testimonial to the container
            testimonialContainer.appendChild(col);
        });
    })
    .catch(error => console.error('Error fetching reviews:', error));
};

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '★';  // Full star for the rating
        } else {
            stars += '☆';  // Empty star for the remaining
        }
    }
    return stars;
}





// document.getElementById('reviewForm').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     const orderId = getQueryParams("order_id");  // Assume the order_id is in the URL
//     const reviewRating = document.getElementById('reviewRating').value;
//     const reviewText = document.getElementById('reviewText').value;
//     const token = localStorage.getItem("token");

//     if (!token) {
//         alert("You must be logged in to submit a review.");
//         return;
//     }

//     // Fetch the order details to check the status
//     fetch(`http://127.0.0.1:8000/food/checkout/${orderId}/`, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//         },
//     })
//     .then(res => res.json())
//     .then(order => {
//         if (order.order_status !== 'delivered') {
//             alert("You can only review an order once it has been delivered.");
//         } else {
//             // Submit the review
//             fetch(`http://127.0.0.1:8000/food/review/`, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json',
//                    'Authorization': `Token ${token}`,
//                 },
//                 body: JSON.stringify({
//                     order_id: orderId,
//                     rating: reviewRating,
//                     text: reviewText,
//                 }),
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.detail) {
//                     alert(data.detail);
//                 } else {
//                     alert("Review submitted successfully!");
//                     // Optionally, clear the form or redirect the user
//                 }
//             })
//             .catch(error => {
//                 console.error("Error submitting review:", error);
//             });
//         }
//     })
//     .catch(error => {
//         console.error("Error checking order status:", error);
//     });
// });

