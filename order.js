const loaditem = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:8000/food/checkout/${userId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data.orders);
        data.orders.forEach((order) => {
            console.log(order)
            const parent = document.getElementById("table-body");
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.email}</td>
                <td>${order.address}</td>
                <td>${order.order_items[0].name}</td>
                <td>${order.order_items[0].quantity}</td>
                <td>${order.order_items[0].price}</td>
                <td>${order.total_price}</td>
                <td>Pending...</td>
           
            `;
            parent.appendChild(tr);
            // localStorage.removeItem('order_id');
        })

    })
    .catch((error) => console.error('Error fetching doses:', error));
  };
  
loaditem();