document.addEventListener('DOMContentLoaded', function () {
    const latencyChartCtx = document.getElementById('latency-chart').getContext('2d');
    const trafficChartCtx = document.getElementById('traffic-chart').getContext('2d');

    const latencyChart = new Chart(latencyChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Latensi (ms)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Latensi (ms)'
                    }
                }
            }
        }
    });

    const trafficChart = new Chart(trafficChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Bandwidth (Mbps)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Bandwidth (Mbps)'
                    }
                }
            }
        }
    });

    function fetchData() {
        fetch('https://cloud-nms.onrender.com/data/latest')  // endpoint diperbaiki
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('network-status').textContent = data.network_status;
                document.getElementById('service-quality').textContent = data.service_quality;
                document.getElementById('network-traffic').textContent = data.network_traffic + ' Mbps';
                document.getElementById('latency').textContent = data.latency + ' ms';
                document.getElementById('active-users').textContent = data.active_users;
                document.getElementById('network-availability').textContent = data.network_availability;
    
                document.getElementById('jitter').textContent = data.jitter + ' ms';
                document.getElementById('packetLoss').textContent = data.packetLoss + ' %';
                document.getElementById('bandwidth').textContent = data.bandwidth + ' Mbps';
                document.getElementById('device-id').textContent = data.device_id || '-';
                document.getElementById('device-name').textContent = data.device_name || '-';
    
                // Update grafik latensi
                latencyChart.data.labels.push(new Date().toLocaleTimeString());
                latencyChart.data.datasets[0].data.push(data.latency);
                latencyChart.update();
    
                // Update grafik bandwidth
                trafficChart.data.labels.push(new Date().toLocaleTimeString());
                trafficChart.data.datasets[0].data.push(data.bandwidth);
                trafficChart.update();
    
                // Batasi jumlah data grafik agar tidak terlalu banyak
                if (latencyChart.data.labels.length > 20) {
                    latencyChart.data.labels.shift();
                    latencyChart.data.datasets[0].data.shift();
                }
                if (trafficChart.data.labels.length > 20) {
                    trafficChart.data.labels.shift();
                    trafficChart.data.datasets[0].data.shift();
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    
    setInterval(fetchData, 5000);
    fetchData();
    
});
