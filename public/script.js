async function fetchMetrics() {
    try {
        // Fetch the metrics from your backend
        let response = await fetch("https://docker-monitoring-backend-exfde3b8bfafgtae.canadacentral-01.azurewebsites.net/metrics");

        // Parse the JSON response
        let data = await response.json();

        // Clear the existing content in the metrics div
        const metricsContainer = document.getElementById("metrics");
        metricsContainer.innerHTML = ''; // Clear old data

        // Check if data was returned
        if (data.length === 0) {
            metricsContainer.innerHTML = '<p>No container data available.</p>';
        } else {
            // Display the container data in a readable format
            data.forEach(container => {
                const containerElement = document.createElement('div');
                containerElement.classList.add('container-metrics');
                containerElement.innerHTML = `
                    <h3>Container: ${container.name}</h3>
                    <p><strong>CPU Usage:</strong> ${container.cpuUsage} units</p>
                    <p><strong>Memory Usage:</strong> ${container.memoryUsage} bytes</p>
                    <p><strong>Memory Limit:</strong> ${container.memoryLimit} bytes</p>
                `;
                metricsContainer.appendChild(containerElement);
            });
        }
    } catch (error) {
        // If there's an error, show this message
        document.getElementById("metrics").innerText = "Error loading data.";
    }
}

// Refresh every 5 seconds
setInterval(fetchMetrics, 5000);

// Initial call to fetch metrics when the page loads
fetchMetrics();
