const loaditem = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:8000/food/checkout/user/${userId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        data.forEach((order) => {
            const parent = document.getElementById("table-body");
            order.order_items.forEach((item) => {
                const tr = document.createElement("tr");
                tr.id = `order-row-${order.id}`;
                tr.innerHTML = `
                    <td >${order.id}</td>
                    <td>${order.email}</td>
                    <td>${order.address}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${order.total_price}</td>
                    <td>${order.order_status}</td>
                    ${
                        order.order_status == "Pending"
                        ? `<td class="text-center"><a class="text-danger text-decoration-none" style="cursor: pointer;" onclick="deleteOrder(${order.id})">Cancel</a></td>`
                        : ``
                    }
                    ${
                        order.order_status == "Delivered"
                        ? `<td><button class=" btn-review" onclick="openReviewModal(${order.id})">Leave a Review</button></td>`
                        : ``
                    }
                    
                `;
                parent.appendChild(tr);
                localStorage.removeItem('order_id');
            });
              
        });

    })
    .catch((error) => console.error('Error fetching order:', error));
  };
  
loaditem();


let currentOrderId;
let currentUser = localStorage.getItem("username");

function openReviewModal(orderId) {
    currentOrderId = orderId;
    document.getElementById("modalOrderId").innerText = orderId;
    // document.getElementById("modalUserName").innerText = currentUser;

    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
}

function submitReview() {
    const rating = document.getElementById("reviewRating").value;
    const reviewText = document.getElementById("reviewText").value;

    console.log(`Submitting review for order ${currentOrderId} with rating ${rating} and review: ${reviewText}`);
    
    
    const token = localStorage.getItem("token");
    fetch('http://127.0.0.1:8000/food/reviews/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            order: currentOrderId,
            rating: rating,
            review_text: reviewText
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Review submitted:', data);
        
    })
    .catch((error) => console.error('Error submitting review:', error));
}


















const deleteOrder = (orderId) => {
    const token = localStorage.getItem("token");

    fetch(`http://127.0.0.1:8000/food/checkout/order/${orderId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
    .then((response) => {
        if (response.ok) {
            const row = document.getElementById(`order-row-${orderId}`);
            if (row) {
                row.remove();
            }
        } else {
            console.error("Failed to delete order:", response.statusText);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
};