document.addEventListener('DOMContentLoaded', function () {
    fetchEvents();
    const token = getTokenFromQueryParams();
    toggleEventCreationForm(isAdmin(token));
    calculateAndDisplayCountdown(); // Call the function to calculate and display countdown
});

async function fetchEvents() {
    try {
        const response = await fetch('https://ticket-backend-1-09ex.onrender.com/api/events');
        const data = await response.json();
        const events = data.events;

        const eventListElement = document.getElementById('eventList');
        eventListElement.innerHTML = '';

        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('eventItem'); // Add event item class
            eventItem.innerHTML = `
                <h2 class="eventName">${event.event_name}</h2>
                <p class="eventDetails"><strong>Event ID:</strong> ${event.event_id}</p>
                <p class="eventDetails"><strong>Location:</strong> ${event.event_location}</p>
                <p class="eventDetails"><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
                <p class="eventDetails"><strong>Regular Price:</strong> ${event.regular_price}</p>
                <p class="eventDetails"><strong>VIP Price:</strong> ${event.vip_price}</p>
                <p class="eventDetails"><strong>Normal Price:</strong> ${event.normal_price}</p>
                <img class="eventFlyer" src="${event.event_flyer}" alt="Event Flyer">
                <p class="eventCountdown" id="countdown_${event._id}"></p> 
                <button class="purchaseTicketBtn" data-event-id="${event._id}">Purchase Ticket</button> 
            `;

            // Add click event listener to the Purchase Ticket button
            const purchaseTicketBtn = eventItem.querySelector('.purchaseTicketBtn');
            purchaseTicketBtn.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                const eventData = {
                    eventId,
                    eventName: event.event_name,
                    eventLocation: event.event_location,
                    eventDate: event.event_date,
                    regularPrice: event.regular_price,
                    vipPrice: event.vip_price,
                    normalPrice: event.normal_price,
                    eventFlyer: event.event_flyer
                };
                redirectToTicketPurchaseForm(eventData);
            });

            eventListElement.appendChild(eventItem);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function calculateAndDisplayCountdown() {
    setInterval(() => {
        const events = document.querySelectorAll('.eventItem');
        events.forEach(event => {
            const eventId = event.querySelector('.purchaseTicketBtn').getAttribute('data-event-id');
            const eventDate = new Date(event.querySelector('.eventDetails').innerText.split(':')[1].trim()).getTime();
            const countdownElement = document.getElementById(`countdown_${eventId}`);
            if (countdownElement) {
                const { days, hours, minutes, seconds } = calculateCountdown(eventDate);
                countdownElement.textContent = `Countdown: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
            }
        });
    }, 1000);
}

function calculateCountdown(eventDate) {
    const now = new Date().getTime();
    const distance = eventDate - now;
    if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
}

function redirectToTicketPurchaseForm(eventData) {
    const queryString = Object.entries(eventData)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    window.location.href = `ticketPurchaseForm.html?${queryString}`;
}

function getTokenFromQueryParams() {
    return new URLSearchParams(window.location.search).get('token');
}

function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
}

function isAdmin(token) {
    const payload = decodeToken(token);
    console.log('Token Payload:', payload); // Log the decoded token payload
    const isAdmin = payload.isAdmin === true;
    console.log('isAdmin:', isAdmin); // Log the isAdmin status
    return isAdmin;
}

// Function to toggle event creation form based on user role
function toggleEventCreationForm(isAdmin) {
    const form = document.getElementById('eventCreationForm');
    if (isAdmin) {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}


























