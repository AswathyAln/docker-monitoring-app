const express = require('express');
const path = require('path');
const Docker = require('dockerode');
const cors = require('cors');  // Import the cors module
const app = express();
const port = process.env.PORT || 3001;  // Change the default port to 3001

const docker = new Docker({ socketPath: '//./pipe/docker_engine' });
// Connect to Docker

// Enable CORS for all domains (or set it to specific domains)
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Serve the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));  // Serve index.html from 'public' folder
});

// Endpoint to get Docker container metrics
app.get('/metrics', async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });

        const statsPromises = containers.map(async (containerInfo) => {
            const container = docker.getContainer(containerInfo.Id);
            const stats = await container.stats({ stream: false });

            return {
                id: containerInfo.Id,
                name: containerInfo.Names[0],
                cpuUsage: stats.cpu_stats.cpu_usage ? stats.cpu_stats.cpu_usage.total_usage : 'No data',
                memoryUsage: stats.memory_stats.usage ? stats.memory_stats.usage : 'No data',
                memoryLimit: stats.memory_stats.limit ? stats.memory_stats.limit : 'No data'
            };
        });

        const stats = await Promise.all(statsPromises);

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(stats, null, 2));
    } catch (err) {
        console.error('Error retrieving Docker metrics:', err.message);
        res.status(500).send('Error retrieving Docker metrics: ' + err.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);  // Updated to use port 3001
});
