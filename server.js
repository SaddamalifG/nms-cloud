const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // <-- ini penting

// Koneksi ke database
const db = mysql.createConnection({
  host: 'your-database-host', // bisa PlanetScale atau Render MySQL
  user: 'your-user',
  password: 'your-password',
  database: 'monitoring_jaringan'
});

db.connect((err) => {
  if (err) {
    console.error('Gagal koneksi ke database:', err);
    return;
  }
  console.log('Terhubung ke database MySQL');
});

// API Endpoint
app.post('/data', (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO data_jaringan 
    (device_id, device_name, latency, jitter, packetLoss, bandwidth, network_status, service_quality, network_traffic, active_users, network_availability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    data.id,
    data.device,
    data.latency,
    data.jitter,
    data.packetLoss,
    data.bandwidth,
    data.network_status,
    data.service_quality,
    data.network_traffic,
    data.active_users,
    data.network_availability
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error('Error menyimpan data:', err);
      res.status(500).json({ message: 'Gagal menyimpan data' });
      return;
    }
    res.status(200).json({ message: 'Data berhasil disimpan' });
  });
});

app.get('/data/latest', (req, res) => {
  const sql = 'SELECT * FROM data_jaringan ORDER BY created_at DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error mengambil data:', err);
      res.status(500).json({ message: 'Gagal mengambil data' });
      return;
    }
    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
