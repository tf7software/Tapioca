// Server-side Node.js code to handle API requests

const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY; // Access API key from environment variables

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Route to generate text from user-provided prompt
app.post('/generateText', express.json(), async (req, res) => {
    const prompt = req.body.prompt;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ text });
});

// Serve static files
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
