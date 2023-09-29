import { executeGlobal } from '../global-db'; // Sesuaikan path dengan struktur proyek Anda

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const results = await executeGlobal('SELECT id, item FROM barang');
      const bgst = results.map(row => ({ id: row.id, item: row.item }));
      return res.status(200).json(bgst);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
