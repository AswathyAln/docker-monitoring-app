const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080; // Use Azure's provided port

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to get Prometheus metrics
app.get('/metrics', (req, res) => {
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

