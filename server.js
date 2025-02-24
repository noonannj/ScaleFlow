// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Your OpenAI API key must be in a .env file as follows:
// OPENAI_API_KEY=your_openai_api_key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint for text generation via GPT‑4
app.post('/generate-text', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative content generator for e-commerce brands." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    res.json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error generating text:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

// Endpoint for image generation via DALL‑E 2
app.post('/generate-image', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    res.json({ image_url: response.data.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend service listening on port ${PORT}`);
});
