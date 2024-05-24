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
    displayText(prompt, data.text);
}

// Function to format text with * or • for new lines and ** for double new lines
function formatText(text, symbol) {
    const placeholder = '---DOUBLE_NEWLINE---';
    const formattedText = text.replace(/\*\*/g, placeholder).split('*').map(part => part.trim());
    return formattedText.map(part => part.replace(new RegExp(placeholder, 'g'), '\n\n'));
}

// Function to display both user input and AI response
function displayText(userInput, aiResponse) {
    const outputDiv = document.getElementById('output');

    // Create a container div to hold both user and AI entries together
    const conversationDiv = document.createElement('div');

    // Display user input
    const formattedUserInput = formatText(userInput, '*');
    formattedUserInput.forEach(part => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `* ${part}`;
        userDiv.classList.add('output-entry', 'user-input');
        conversationDiv.appendChild(userDiv);
    });

    // Display AI response
    const formattedAiResponse = formatText(aiResponse, '•');
    formattedAiResponse.forEach(part => {
        const aiDiv = document.createElement('div');
        aiDiv.textContent = `• ${part}`;
        aiDiv.classList.add('output-entry', 'ai-output');
        conversationDiv.appendChild(aiDiv);
    });

    // Prepend the conversation div to the output div
    outputDiv.prepend(conversationDiv);
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    generateText(prompt);
    document.getElementById('prompt').value = ''; // Clear the input field after submission
}

// Attach event listener to form submission
document.getElementById('promptForm').addEventListener('submit', handleSubmit);
