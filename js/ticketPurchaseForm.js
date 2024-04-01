document.addEventListener('DOMContentLoaded', function () {
    const ticketPurchaseForm = document.getElementById('ticketPurchaseForm');
    const eventIdInput = document.getElementById('eventId');

    // Get the event ID from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    if (eventId) {
        eventIdInput.value = eventId;
    }

    ticketPurchaseForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const ticketType = document.getElementById('ticketType').value;
        const quantity = document.getElementById('quantity').value;

        const formData = {
            email,
            eventId,
            ticketType,
            quantity
        };

        try {
            const response = await fetch('https://ticket-backend-1-09ex.onrender.com/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
          
            if (!response.ok) {
                throw new Error('Failed to purchase tickets');
            }



            const data = await response.json();
            console.log(data);
            // Redirect or display success message
            window.location.href = 'user_purchase_details.html';
        } catch (error) {
            console.error('Error purchasing tickets:', error);
            // Display error message
        }
    });
});