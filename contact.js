
function addContact(event) {
    event.preventDefault(); 

    const name = document.querySelector('input[placeholder="Your Name"]').value;
    const email = document.querySelector('input[placeholder="Your Email"]').value;
    const message = document.querySelector('textarea[placeholder="Message"]').value;

    const data = {
        name: name,
        email: email,
        message: message
    };

    fetch('https://fooddelivery-lyart.vercel.app/contact/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // success message
        document.getElementById('con-message').textContent = "Thank you for your message! We'll get back to you soon.";
        document.getElementById('con-message').style.color = "green";

        // Clear fields
        document.getElementById('contactForm').reset();
    })
    .catch((error) => {
        // error message
        document.getElementById('con-message').textContent = "There was a problem submitting your message. Please try again later.";
        document.getElementById('con-message').style.color = "red";
        console.error('Error:', error);
    });
}

