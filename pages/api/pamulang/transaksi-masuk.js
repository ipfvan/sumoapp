import { executePamulang } from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { startDate, endDate } = req.query;

      // Query untuk mengambil data transaksi berdasarkan rentang tanggal
      const queryString = 'SELECT * FROM transaksi_masuk WHERE tanggal_transaksi BETWEEN ? AND ?';
      const results = await executePamulang(queryString, [startDate, endDate]);

      res.status(200).json(results);
    } else if (req.method === 'POST') {
      const { item, tanggal, qty, pengirim } = req.body;



        // Query untuk memasukkan data transaksi ke dalam tabel transaksi_keluar
        const insertQuery = `
          INSERT INTO transaksi_masuk (tanggal_transaksi, barang_id, qty, pengirim)
          VALUES (?, ?, ?, ?)
        `;

        await executePamulang(insertQuery, [tanggal, item, qty, pengirim]);

        res.status(200).json({ message: 'Transaksi submitted successfully' });
      
    } else if (req.method === 'DELETE') {
      const itemId = req.query.id; // Mengambil item ID sebagai query parameter
      // Query untuk menghapus transaksi berdasarkan ID
      const deleteQuery = 'DELETE FROM transaksi_masuk WHERE id = ?';
      await executePamulang(deleteQuery, [itemId]);

      res.status(200).json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
