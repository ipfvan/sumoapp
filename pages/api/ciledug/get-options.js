import { executeGlobal } from '../global-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { action, kategori } = req.query;

    try {
      if (action === 'kategori') {
        // Mengambil data kategori dari basis data
        const kategoriQuery = 'SELECT DISTINCT kategori FROM barang';
        const results = await executeGlobal(kategoriQuery);

        const kategoriOptions = results.map((row) => row.kategori);
        res.status(200).json(kategoriOptions);
      } else if (action === 'item' && kategori) {
        // Mengambil data item berdasarkan kategori dari basis data
        const itemQuery = 'SELECT id, item FROM barang WHERE kategori = ?';
        const itemResults = await executeGlobal(itemQuery, [kategori]);

        const itemOptions = itemResults.map((row) => ({ id: row.id, item: row.item }));

        res.status(200).json(itemOptions);
      } else {
        res.status(400).json({ error: 'Invalid action or missing parameters' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
