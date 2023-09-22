import connection from './db';

export default (req, res) => {
  if (req.method === 'POST') {
    const { id, barang_id, tanggal_transaksi, qty, penerima } = req.body;
    const insertQuery = 'INSERT INTO transaksi_keluar (id, barang_id, tanggal_transaksi, qty, penerima) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [id, barang_id, tanggal_transaksi, qty, penerima], (err, results) => {
      if (err) {
        console.error('Error inserting data into transaksi keluar: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        console.log('Data inserted successfully'); // Debugging
        res.status(201).json({ message: 'Data inserted successfully' });
      }
    });
  } else if (req.method === 'GET') {
    const id = req.query.id; // Get the id from the query parameter
    const selectQuery = `SELECT * FROM transaksi_keluar WHERE id = ?`;
    connection.query(selectQuery, [id], (err, results) => {
      if (err) {
        console.error('Error fetching transaksi keluar data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        res.status(200).json(results);
      }
    });
  } else if (req.method === 'PUT') {
    const { id, barang_id, tanggal_transaksi, qty, penerima } = req.body;
    const updateQuery = 'UPDATE transaksi_keluar SET barang_id = ?, tanggal_transaksi = ?, qty = ?, penerima = ? WHERE id = ?';
    connection.query(updateQuery, [barang_id, tanggal_transaksi, qty, penerima, id], (err, results) => {
      if (err) {
        console.error('Error updating data in transaksi keluar: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        console.log('Data updated successfully'); // Debugging
        res.status(200).json({ message: 'Data updated successfully' });
      }
    });
  } else {
    res.status(405).end();
  }
};

