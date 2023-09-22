import mysql from 'mysql';

// Koneksi ke database ciledug_db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pendaftaran_db', // Ganti dengan nama database Anda
});

export default (req, res) => {
  if (req.method === 'GET') {
    connection.query('SELECT id, item FROM barang', (error, results) => {
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Error fetching data' });
      }

      const bgst = results.map(row => ({ id: row.id, item: row.item }));
      return res.status(200).json(bgst);
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
