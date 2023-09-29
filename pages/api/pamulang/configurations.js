import { executePamulang } from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Query untuk mengambil data konfigurasi
      const getConfigQuery = 'SELECT * FROM configurations';
      const results = await executePamulang(getConfigQuery);
      res.status(200).json(results);
    } else if (req.method === 'POST') {
      // Handle POST request untuk memperbarui data konfigurasi
      const { jamMulai, jamBreak, jamBreakAkhir, jamTutup } = req.body;

      // Query untuk memperbarui data konfigurasi
      const updateConfigQuery = `
        UPDATE configurations
        SET jam_mulai = ?, jam_break = ?, jam_break_akhir = ?, jam_tutup = ?
        WHERE id = 1; 
      `;

      await executePamulang(updateConfigQuery, [jamMulai, jamBreak, jamBreakAkhir, jamTutup]);
      res.status(200).json({ message: 'Konfigurasi berhasil diperbarui' });
    } else {
      res.status(405).json({ message: 'Metode tidak diizinkan' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Kesalahan server internal' });
  }
}
