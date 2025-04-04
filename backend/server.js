const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;  // Changed the port from 3000 to 3001

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to get Prometheus metrics
app.get('/metrics', (req, res) => {
    // Replace this with the actual logic to get Docker metrics
    res.set('Content-Type', 'text/plain');
    fs.readFile(path.join(__dirname, 'metrics.txt'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading metrics file');
        }
        res.send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
