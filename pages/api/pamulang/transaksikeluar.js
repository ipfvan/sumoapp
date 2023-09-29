import { executePamulang } from '../pamulang-db';


export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { id, barang_id, tanggal_transaksi, qty, penerima } = req.body;
      const insertQuery = 'INSERT INTO transaksi_keluar (id, barang_id, tanggal_transaksi, qty, penerima) VALUES (?, ?, ?, ?, ?)';
      await executePamulang(insertQuery, [id, barang_id, tanggal_transaksi, qty, penerima]);
      console.log('Data inserted successfully'); // Debugging
      res.status(201).json({ message: 'Data inserted successfully' });
    } else if (req.method === 'GET') {
      const id = req.query.id; // Ambil id dari parameter query
      const selectQuery = 'SELECT * FROM transaksi_keluar WHERE id = ?';
      const results = await executePamulang(selectQuery, [id]);
      res.status(200).json(results);
    } else if (req.method === 'PUT') {
      const { id, barang_id, tanggal_transaksi, qty, penerima } = req.body;
      const updateQuery = 'UPDATE transaksi_keluar SET barang_id = ?, tanggal_transaksi = ?, qty = ?, penerima = ? WHERE id = ?';
      const result = await executePamulang(updateQuery, [barang_id, tanggal_transaksi, qty, penerima, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        console.log('Data updated successfully'); // Debugging
        res.status(200).json({ message: 'Data updated successfully' });
      }
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
