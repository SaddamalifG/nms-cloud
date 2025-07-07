const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'interchange.proxy.rlwy.net',
  user: 'root',
  password: 'DrMGmyXdslkGDYHfPyGGhorFeTGdMKAr',
  database: 'railway',
  port: 28766,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) {
    console.error('❌ Koneksi gagal:', err.message);
  } else {
    console.log('✅ Koneksi ke MySQL Railway berhasil!');
    db.end();
  }
});
