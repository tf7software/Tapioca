document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    const map = L.map('map').setView([20, 0], 2); // Centered at (20, 0) with zoom level 2
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add Leaflet search control
    const searchControl = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Search for a place',
        geocoder: L.Control.Geocoder.nominatim(),
        position: 'topright',
        showResultIcons: true,
        collapsed: true
    }).on('markgeocode', function(e) {
        const { center } = e.geocode;
        const selectedDestination = `${center.lat},${center.lng}`;
        document.getElementById('destination').value = selectedDestination;
    }).addTo(map);

    // Add click event to the map
    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        const selectedDestination = `${lat},${lng}`;
        document.getElementById('destination').value = selectedDestination;
    });

    // Initialize Flatpickr for the calendar inputs
    flatpickr('.calendar', {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
    });
});

function updateBudgetValue(value) {
    document.getElementById('budgetValue').textContent = `$${value}`;
}

async function generateText() {
    const destination = document.getElementById('destination').value;
    const budget = document.getElementById('budget').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const tripPurpose = document.getElementById('trip-purpose').value;
    const factors = document.getElementById('factors').value;
    const question = `I'm going on a ${tripPurpose} trip to ${destination}. My budget level is $${budget}, I get there ${startTime} and get back ${endTime} , and other factors to consider are: ${factors}. Can you recommend the best places to stay, eat, and see while I'm there, including price and quality? DO NOT ASK FOR ANY OTHER DETAILS, reccomend the places like so:

Hotel/Motels"
Budget: 1(price) 2(price) 3(price) 
Mid-Class: 1(price) 2(price) 3(price)
High-Class 1(price) 2(price) 3(price) 

do the same with food and for places to see just display and describe them, also give links to everything`;

    // Display user input
    addMessageToChatbox(`* $Asking Ai...`);

    try {
        const response = await fetch('/generateText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: question })
        });

        const data = await response.json();
        if (data.text) {
            addMessageToChatbox(`• ${formatResponse(data.text)}`);
        } else {
            addMessageToChatbox('• No response from AI.');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessageToChatbox('• Error communicating with AI.');
    }
}

function addMessageToChatbox(message) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = formatMessage(message);
    chatbox.insertBefore(messageElement, chatbox.firstChild);
}

function formatMessage(message) {
    return message.replace(/\*\*/g, '\n\n').replace(/\*/g, '\n');
}

function formatResponse(response) {
    return response.replace(/\*\*/g, '\n\n').replace(/\*/g, '\n');
}
