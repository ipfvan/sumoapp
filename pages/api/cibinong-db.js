import mysql from 'mysql2/promise';

// Konfigurasi koneksi ke MySQL
const dbConfig = {
 host: 'localhost',
  user: 'ipfvan',
  password: 'Mych3micalz',
  database: 'cibinong_db',
};

export async function executeCibinong(sql, params) {
  // Membuat koneksi baru setiap kali eksekusi query
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log('Koneksi terhubung'); // Log koneksi terhubung

    const [results, fields] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.end(); // Menutup koneksi setelah penggunaan
    console.log('Koneksi dilepaskan'); // Log koneksi dilepaskan
  }
}
