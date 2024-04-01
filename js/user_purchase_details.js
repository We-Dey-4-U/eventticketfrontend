document.addEventListener('DOMContentLoaded', async function () {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }
        const decodedToken = parseJwt(token);
        const userId = decodedToken.userId;

        const response = await fetch(`https://ticket-backend-1-09ex.onrender.com/api/tickets/user/${userId}`);
        const data = await response.json();
        const userTickets = data.userTickets;

        if (userTickets.length === 0) {
            console.error('User has no purchased tickets');
            return;
        }

        const qrCodeContainer = document.getElementById('qrCodeContainer');
        qrCodeContainer.innerHTML = ''; // Clear previous QR code images
        
        // Loop through each user ticket
        for (const ticket of userTickets) {
            // Create a new QR code image element
            const qrCodeImg = document.createElement('img');
            qrCodeImg.src = `https://ticket-backend-1-09ex.onrender.com/qr_images/ticket_qr_${ticket._id}.png`; // Updated path to fetch images from qr_images directory
            qrCodeImg.alt = 'QR Code';
            qrCodeImg.classList.add('qr-code-img');
            
            // Append the QR code image to the container
            qrCodeContainer.appendChild(qrCodeImg);
        }
        
        // Display payment method for the first ticket (assuming it's the same for all)
        const paymentMethodText = document.getElementById('paymentMethodText');
        paymentMethodText.textContent = userTickets[0].payment_method;
        
        // Retrieve event details for the first ticket (assuming it's the same for all)
        const eventId = userTickets[0].event_id; 
        const eventResponse = await fetch(`https://ticket-backend-1-09ex.onrender.com/api/events/${eventId}`);
        const eventData = await eventResponse.json();
        
        if (eventData.error) {
            console.error('Error retrieving event:', eventData.error);
            // Handle the error accordingly
        } else {
            const event = eventData.event;

            // Set the event flyer image source directly  <p><strong>Ticket Price:</strong> ${userTickets[0].ticket_price}</p>
            document.getElementById('eventFlyerImg').src = event.event_flyer;
            
            // Display custom event ID in purchase details
            const purchaseDetailsDiv = document.getElementById('purchaseDetails');
            purchaseDetailsDiv.innerHTML = `
                <p><strong>Event ID:</strong> ${event.event_id}</p> <!-- Display custom event ID -->
                <p><strong>Event Name:</strong> ${event.event_name}</p>
                <p class="eventDetails"><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p> 
                <p><strong>Ticket Type:</strong> ${userTickets[0].ticket_type}</p>
                <p><strong>Quantity:</strong> ${userTickets[0].quantity}</p> 
                <p class="eventDetails"><strong>Total Price:</strong> ${userTickets[0].total_price}</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching user purchase details:', error);
        // Handle error message or feedback to the user
    }
});

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function handlePayment(paymentOption) {
    try {
        console.log(`Initiating ${paymentOption} payment...`);
        // Add payment processing logic here
    } catch (error) {
        console.error('Error processing payment:', error);
        // Handle error message or feedback to the user
    }
}