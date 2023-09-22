import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pamulang_db', // Ganti dengan nama database Anda
});

export default (req, res) => {
  if (req.method === 'POST') {
    const {item, tanggal, qty, penerima, pengirim } = req.body;

 
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

          // Mulai transaksi
          connection.beginTransaction(error => {
            if (error) {
              console.error('Error starting transaction:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Masukkan data transaksi ke tabel transaksi_masuk
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
                  connection.rollback(() => {
                    res.status(500).json({ error: 'Internal Server Error' });
                  });
                } else {
                  // Commit transaksi
                  connection.commit(commitError => {
                    if (commitError) {
                      console.error('Error committing transaction:', commitError);
                      connection.rollback(() => {
                        res.status(500).json({ error: 'Internal Server Error' });
                      });
                    } else {
                      res.status(200).json({ message: 'Transaksi submitted successfully' });
                    }
                  });
                }
              }
            );
          });
        }
      }
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
