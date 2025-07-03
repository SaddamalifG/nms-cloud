require('dotenv').config();
const express = require('express');
const mysql = require('mysql2'); // ✅ gunakan hanya mysql2
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080; // ✅ Railway otomatis set PORT

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // ✅ untuk akses frontend

// Koneksi ke database MySQL Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi ke database gagal:', err);
    process.exit(1); // Keluar dari app jika koneksi gagal
  }
  console.log('✅ Terhubung ke database MySQL Railway');
});

// Endpoint untuk menerima data dari ESP32/frontend
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
      console.error('❌ Error menyimpan data:', err);
      return res.status(500).json({ message: 'Gagal menyimpan data' });
    }
    res.status(200).json({ message: '✅ Data berhasil disimpan' });
  });
});

// Endpoint untuk mengambil data terbaru
app.get('/data/latest', (req, res) => {
  const sql = 'SELECT * FROM data_jaringan ORDER BY created_at DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error mengambil data:', err);
      return res.status(500).json({ message: 'Gagal mengambil data' });
    }
    res.json(results[0]);
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
