const loaditem = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    fetch(`https://foodapi-flame.vercel.app/food/checkout/${userId}/`, {
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
            const parent = document.getElementById("table-body");
            order.order_items.forEach((item) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.email}</td>
                    <td>${order.address}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${order.total_price}</td>
                    <td>Pending...</td>
                `;
                parent.appendChild(tr);
                localStorage.removeItem('order_id');
            });
              
        });

    })
    .catch((error) => console.error('Error fetching doses:', error));
  };
  
loaditem();