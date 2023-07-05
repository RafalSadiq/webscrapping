const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/",  (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// Endpoint to get insights
app.post("/", async (req, res) => {
  const { url } = req.body;
  try {
    const wordCount = await countWords(url);
    const insight = {
      url,
      wordCount,
      favorite: false,
      mediaLinks: [],
    };
    res.json(insight);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'An error occurred while counting words.' });
  }
});

// Function to count words
async function countWords(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const text = $('body').text();
    const words = text.split(/\s+/); // Split by whitespace
    return words.length;
  } catch (error) {
    throw new Error('An error occurred while counting words.');
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
