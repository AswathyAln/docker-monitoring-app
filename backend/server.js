const express = require('express');
const path = require('path');
const Docker = require('dockerode'); // Import Dockerode
const app = express();
const port = process.env.PORT || 3001; // Use Azure's provided port or default to 3001

const docker = new Docker(); // Connect to Docker

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to get Docker container metrics
app.get('/metrics', async (req, res) => {
    try {
        // Get all containers (running or stopped)
        const containers = await docker.listContainers({ all: true });

        // Get stats for each container
        const statsPromises = containers.map(async (containerInfo) => {
            const container = docker.getContainer(containerInfo.Id);
            const stats = await container.stats({ stream: false });

            // Log the stats to see the raw data
            console.log(stats); // Print out each container's stats

            // Return container metrics, handle missing data
            return {
                id: containerInfo.Id,
                name: containerInfo.Names[0],
                cpuUsage: stats.cpu_stats.cpu_usage ? stats.cpu_stats.cpu_usage.total_usage : 'No data',
                memoryUsage: stats.memory_stats.usage ? stats.memory_stats.usage : 'No data',
                memoryLimit: stats.memory_stats.limit ? stats.memory_stats.limit : 'No data'
            };
        });

        // Wait for all stats
        const stats = await Promise.all(statsPromises);

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(stats, null, 2)); // Send the metrics as JSON
    } catch (err) {
        console.error('Error retrieving Docker metrics:', err.message);
        res.status(500).send('Error retrieving Docker metrics: ' + err.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
