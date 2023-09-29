import { executePamulang} from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    // Mendapatkan parameter dari query string
    const { tanggal_transaksi, barang_id, qty, pengirim } = req.query;

    try {
      // Query SQL untuk menghapus data dari tabel transaksi_masuk berdasarkan parameter
      const deleteQuery = `
        DELETE FROM transaksi_masuk 
        WHERE tanggal_transaksi = ? AND barang_id = ? AND qty = ? AND pengirim = ?
      `;

      // Eksekusi query SQL dengan parameter yang diterima dari query string
      const result = await executePamulang(deleteQuery, [tanggal_transaksi, barang_id, qty, pengirim]);

      // Periksa apakah data berhasil dihapus
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Data deleted successfully', deletedRows: result.affectedRows });
      } else {
        res.status(404).json({ error: 'Data not found' });
      }
    } catch (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).end(); // Metode HTTP yang tidak diizinkan
  }
}
