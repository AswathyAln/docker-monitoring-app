async function fetchMetrics() {
    try {
        // Change the port from 3000 to 3001
        let response = await fetch("http://localhost:3001/metrics");
        let data = await response.text();
        document.getElementById("metrics").innerText = data;
    } catch (error) {
        document.getElementById("metrics").innerText = "Error loading data.";
    }
}

// Refresh every 5 seconds
setInterval(fetchMetrics, 5000);
fetchMetrics();
