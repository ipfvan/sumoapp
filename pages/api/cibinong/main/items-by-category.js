import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pendaftaran_db',
});

// Contoh endpoint
export default (req, res) => {
    if (req.method === 'GET') {
      const { kategori } = req.query;
  
      const selectQuery = `
        SELECT * FROM barang
        WHERE kategori = ?
      `;
  
      connection.query(selectQuery, [kategori], (err, results) => {
        if (err) {
          console.error(`Error fetching ${kategori} options: `, err);
          res.status(500).json({ error: 'Terjadi kesalahan pada server' });
        } else {
          res.status(200).json({ items: results });
        }
      });
    } else {
      res.status(405).end();
    }
  };
  