const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// 1. Load local environment variables from a .env file
// This makes process.env accessible locally
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Serve Static Assets (CSS, JS, Images, etc.)
// This tells Express to serve files from the root of your project
app.use(express.static(path.join(__dirname))); 

// 2. Central Router for SPA (Client-Side Routing)
// For any path not found above (the SPA routes like /admin, /programs), serve index.html
app.get('*', (req, res) => { // Use '*' without the quotes, or explicitly use 'req.path'
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Firebase API Key is loaded in environment.");
});