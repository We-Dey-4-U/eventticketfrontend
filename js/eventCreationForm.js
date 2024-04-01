document.addEventListener('DOMContentLoaded', function () {
    const eventCreationForm = document.getElementById('eventCreationForm');

    eventCreationForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData();
        formData.append('event_name', eventCreationForm.querySelector('#eventName').value);
        formData.append('event_location', eventCreationForm.querySelector('#eventLocation').value);
        formData.append('event_date', eventCreationForm.querySelector('#eventDate').value);
        formData.append('regular_price', eventCreationForm.querySelector('#regularPrice').value); // Include regular price
        formData.append('vip_price', eventCreationForm.querySelector('#vipPrice').value); // Include VIP price
        formData.append('normal_price', eventCreationForm.querySelector('#normalPrice').value); // Include normal price
        formData.append('event_flyer', eventCreationForm.querySelector('#eventFlyer').files[0]);

        try {
            const response = await fetch('http://localhost:3000/api/events', {   //https://ticket-backend-1-09ex.onrender.com/api/events
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData // Send formData directly
            });
            const data = await response.json();
            console.log(data);
            // Redirect to index.html after successful event creation
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error creating event:', error);
        }
    });
});