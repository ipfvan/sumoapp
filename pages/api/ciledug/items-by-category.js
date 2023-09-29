import { executeGlobal } from '../global-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { kategori } = req.query;

    try {
      // Query untuk mengambil data barang berdasarkan kategori
      const selectQuery = `
        SELECT * FROM barang
        WHERE kategori = ?
      `;

      // Eksekusi query dengan parameter kategori
      const results = await executeGlobal(selectQuery, [kategori]);

      // Kirim hasil query sebagai respons JSON
      res.status(200).json({ items: results });
    } catch (error) {
      console.error(`Error fetching ${kategori} options: `, error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  } else {
    res.status(405).end();
  }
}
