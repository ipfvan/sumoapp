import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    // Assuming startDate and endDate are in the format 'YYYY-MM-DD'
    const queryString = 'SELECT * FROM transaksi_masuk WHERE tanggal_transaksi BETWEEN ? AND ?';
    
    connection.query(queryString, [startDate, endDate], (error, results) => {
      if (error) {
        console.error('Error fetching transaksi by date range:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
      } else {
        res.status(200).json(results);
      }
    });
  } else if (req.method === 'POST') {
    const { kategori, item, tanggal, qty, pengirim } = req.body;

    // Dapatkan barang_id berdasarkan item dan kategori
    connection.query(
      'SELECT id FROM barang WHERE item = ?',
      [item],
      (error, results) => {
        if (error) {
          console.error('Error fetching barang_id:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.length === 0) {
          res.status(400).json({ error: 'Barang not found' });
        } else {
          const barangId = results[0].id;

          // Masukkan data transaksi ke tabel transaksi_keluar
          const insertQuery = `
            INSERT INTO transaksi_masuk (tanggal_transaksi, barang_id, qty, pengirim)
            VALUES (?, ?, ?, ?)
          `;

          connection.query(
            insertQuery,
            [tanggal, barangId, qty, pengirim],
            (insertError, insertResults) => {
              if (insertError) {
                console.error('Error inserting transaksi:', insertError);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                res.status(200).json({ message: 'Transaksi submitted successfully' });
              }
            }
          );
        }
      }
    );
  } else if (req.method === 'DELETE') {
    const itemId = req.query.id; // Assuming you pass the item ID as a query parameter
    connection.query('DELETE FROM transaksi_masuk WHERE id = ?', [itemId], (error, results) => {
      if (error) {
        console.error('Error deleting transaksi:', error);
        res.status(500).json({ error: 'An error occurred while deleting the transaction' });
      } else {
        res.status(200).json({ message: 'Transaction deleted successfully' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
