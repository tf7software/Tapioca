// Client-side JavaScript to interact with the Gemini API

// Function to send a prompt to the server and display the generated text
async function generateText(prompt) {
    const response = await fetch('/generateText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    displayText(data.text);
}

// Function to display generated text
function displayText(text) {
    const outputDiv = document.getElementById('output');
    const responseDiv = document.createElement('div');
    responseDiv.textContent = text;
    outputDiv.prepend(responseDiv);
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    generateText(prompt);
}

// Attach event listener to form submission
document.getElementById('promptForm').addEventListener('submit', handleSubmit);
