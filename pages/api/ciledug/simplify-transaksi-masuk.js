import { executeCiledug } from '../ciledug-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;
    // ...
  } else if (req.method === 'DELETE') {
    try {
      // Query untuk menghapus data dengan barang_id 0
      const deleteQuery = 'DELETE FROM transaksi_masuk WHERE barang_id IS NULL OR barang_id = 0';
      
      // Eksekusi query
      await executeCiledug(deleteQuery);
      
      res.status(200).json({ message: 'Data with barang_id 0 deleted successfully' });
    } catch (error) {
      console.error('Error deleting zero barang_id data:', error);
      res.status(500).json({ error: 'An error occurred while deleting data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
