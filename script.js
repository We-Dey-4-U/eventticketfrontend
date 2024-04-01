document.addEventListener('DOMContentLoaded', async function () {
    try {
        const token = new URLSearchParams(window.location.search).get('token');
        const isAdmin = await checkAdmin(token);
        toggleEventCreationForm(isAdmin);
        fetchEvents();
    } catch (error) {
        console.error('Error:', error);
    }
});

async function checkAdmin(token) {
    const payload = decodeToken(token);
    return payload.isAdmin === true;
}

function toggleEventCreationForm(isAdmin) {
    const form = document.getElementById('eventCreationForm');
    if (isAdmin) {
        form.classList.remove('hidden');
    } else {
        form.classList.add('hidden');
    }
}


async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:3000/api/events');
        const data = await response.json();
        const events = data.events;

        const eventListElement = document.getElementById('eventList');
        eventListElement.innerHTML = '';

        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.innerHTML = `
                <h2>${event.event_name}</h2>
                <p><strong>Location:</strong> ${event.event_location}</p>
                <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
                <img src="${event.event_flyer}" alt="Event Flyer">
            `;
            eventListElement.appendChild(eventItem);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}


function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}