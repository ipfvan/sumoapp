import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pamulang_db',
});

export default (req, res) => {

  if (req.method === 'DELETE') {
    // Mendapatkan parameter dari query string
    const { tanggal_transaksi, barang_id, qty, pengirim } = req.query;

    // Query SQL untuk menghapus data dari tabel transaksi_masuk berdasarkan tanggal_transaksi, barang_id, qty, dan pengirim
    const deleteQuery = `
      DELETE FROM transaksi_masuk 
      WHERE tanggal_transaksi = ? AND barang_id = ? AND qty = ? AND pengirim = ?
    `;

    // Menjalankan query SQL dengan parameter yang diterima dari query string
    connection.query(deleteQuery, [tanggal_transaksi, barang_id, qty, pengirim], (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Data berhasil dihapus
        res.status(200).json({ message: 'Data deleted successfully', deletedRows: results.affectedRows });
      }
    });
  } else {
    res.status(405).end(); // Metode HTTP yang tidak diizinkan
  }
};