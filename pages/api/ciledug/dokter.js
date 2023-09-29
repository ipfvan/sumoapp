import { executeCiledug } from '../ciledug-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Handle GET request to fetch data
      const sql = 'SELECT * FROM dokter';
      const rows = await executeCiledug(sql);
      res.status(200).json(rows);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ message: 'Invalid request. Missing id parameter.' });
        return;
      }

      const deleteSql = 'DELETE FROM dokter WHERE id = ?';
      await executeCiledug(deleteSql, [id]);
      res.status(200).json({ message: 'Deleted successfully' });
    } else if (req.method === 'POST') {
      const { nama, no_telp, alamat } = req.body;

      if (!nama || !no_telp || !alamat) {
        res.status(400).json({ message: 'Invalid request. Missing required fields.' });
        return;
      }

      const insertSql = 'INSERT INTO dokter (nama, no_telp, alamat) VALUES (?, ?, ?)';
      await executeCiledug(insertSql, [nama, no_telp, alamat]);
      res.status(201).json({ message: 'Inserted successfully' });
    } else if (req.method === 'PUT') {
      const itemId = req.body.id;
      const column = req.body.column;
      const updatedItem = req.body.updatedItem;

      let updateSql;

      switch (column) {
        case 'nama':
          updateSql = 'UPDATE dokter SET nama = ? WHERE id = ?';
          break;
        case 'no_telp':
          updateSql = 'UPDATE dokter SET no_telp = ? WHERE id = ?';
          break;
        case 'alamat':
          updateSql = 'UPDATE dokter SET alamat = ? WHERE id = ?';
          break;
        default:
          res.status(400).json({ error: 'Invalid column' });
          return;
      }

      await executeCiledug(updateSql, [updatedItem, itemId]);
      res.status(200).json({ message: 'Item updated successfully' });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
