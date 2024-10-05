const loaditem = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    fetch(`https://fooddelivery-lyart.vercel.app/food/checkout/user/${userId}/`, {
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
                        : `<td>Completed</td>`
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



const deleteOrder = (orderId) => {
    const token = localStorage.getItem("token");

    fetch(`https://fooddelivery-lyart.vercel.app/food/checkout/order/${orderId}/`, {
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