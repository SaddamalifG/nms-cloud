require('dotenv').config();
const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

conn.connect((err) => {
  if (err) {
    console.error('❌ Koneksi gagal:', err.message);
  } else {
    console.log('✅ Koneksi berhasil ke database Railway');
  }
  conn.end();
});
