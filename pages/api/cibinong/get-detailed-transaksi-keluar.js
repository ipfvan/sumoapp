import { executeCibinong } from '../cibinong-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    try {
      // Query untuk mendapatkan data yang digabungkan dengan mengelompokkan dan menjumlahkan kuantitas
      const queryString = `
        SELECT tanggal_transaksi, barang_id, SUM(qty) AS total_qty
        FROM transaksi_keluar
        WHERE tanggal_transaksi BETWEEN ? AND ?
        GROUP BY tanggal_transaksi, barang_id
      `;

      // Eksekusi query
      const results = await executeCibinong(queryString, [startDate, endDate]);

      // Kirim hasil query sebagai respons JSON
      res.status(200).json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil transaksi yang digabungkan' });
    }
  } else {
    res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
}
