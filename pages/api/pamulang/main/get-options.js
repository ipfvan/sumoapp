import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pendaftaran_db',
});

export default (req, res) => {
  if (req.method === 'GET') {
    const { action, kategori } = req.query;

    if (action === 'kategori') {
      // Mengambil data kategori dari basis data
      connection.query('SELECT DISTINCT kategori FROM barang', (error, results) => {
        if (error) {
          console.error('Error fetching kategori:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const kategoriOptions = results.map((row) => row.kategori);
          res.status(200).json(kategoriOptions);
        }
      });
    } else if (action === 'item' && kategori) {
      // Mengambil data item berdasarkan kategori dari basis data
      connection.query('SELECT id, item FROM barang WHERE kategori = ?', [kategori], (error, results) => {
        if (error) {
          console.error('Error fetching items:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const itemOptions = results.map((row) => row.item);
          res.status(200).json(itemOptions);
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid action or missing parameters' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
