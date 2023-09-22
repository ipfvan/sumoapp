import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ciledug_db', // Ganti dengan nama database Anda
});



export default (req, res) => {
  if (req.method === 'DELETE') {
    // Extract data from the DELETE request body
    const { tanggal_transaksi, barang_id, qty, pengirim } = req.body;

    // Check if the required parameters are provided
    if (!tanggal_transaksi || !barang_id || !qty || !pengirim) {
      return res.status(400).json({ error: 'Invalid or missing parameters' });
    }

    // Construct the SQL query to delete data in the "transaksi_masuk" table
    const deleteQuery = `
      DELETE FROM transaksi_masuk
      WHERE tanggal_transaksi = ? AND barang_id = ? AND qty = ? AND pengirim = ?
    `;

    // Execute the delete query
    connection.query(
      deleteQuery,
      [tanggal_transaksi, barang_id, qty, pengirim],
      (error, results) => {
        if (error) {
          console.error('Error deleting data in transaksi_masuk:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any rows were affected (indicating successful deletion)
        if (results.affectedRows > 0) {
          return res.status(200).json({ message: 'Data deleted successfully' });
        } else {
          return res.status(404).json({ error: 'Data not found' });
        }
      }
    );
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
