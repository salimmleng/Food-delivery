const loaditem = () => {
    const token = localStorage.getItem("token");
    fetch(`https://fooddelivery-lyart.vercel.app/food/checkout/`, {
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
                    <td>${order.address}</td>
                    <td>${item.name}</td>
                    <td>${order.total_price}</td>
                    <td>${order.order_status}</td>
                    ${
                     order.order_status == "Pending"
                     ? `<td class="text-danger "><a style="cursor: pointer;" onclick="completeOrder(${order.id})">Deliver</a></td>`
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


const completeOrder = (orderId) => {
    const token = localStorage.getItem("token");
    console.log(orderId)
    fetch(`https://fooddelivery-lyart.vercel.app/food/checkout/order/${orderId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_status : "Delivered" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.order_status === "Delivered") {
          const row = document.getElementById(`order-row-${orderId}`);
          row.querySelector("td:nth-child(7)").innerText = "Delivered";
          window.location.href = 'admin_order.html';

        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };
