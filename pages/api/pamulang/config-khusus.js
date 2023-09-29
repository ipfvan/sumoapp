import { executePamulang } from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

export default async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Handle GET request to fetch data
      const results = await executePamulang('SELECT * FROM specialconfig');
      res.status(200).json(results);
    } else if (req.method === 'POST') {
      // Handle POST request to insert data
      const { tanggal, jamMulai, jamBreak, jamBreakAkhir, jamTutup } = req.body;
      const insertQuery = `INSERT INTO specialconfig (tanggal, jam_mulai_sp, jam_break_sp, jam_break_akhir_sp, jam_tutup_sp) VALUES (?, ?, ?, ?, ?)`;
      const values = [tanggal, jamMulai, jamBreak, jamBreakAkhir, jamTutup];

      await executePamulang(insertQuery, values);
      res.status(201).json({ message: 'Data inserted successfully' });
    } else if (req.method === 'DELETE') {
      // Handle DELETE request to delete data by ID
      const { id } = req.query;
      const deleteQuery = `DELETE FROM specialconfig WHERE id = ?`;

      await executePamulang(deleteQuery, [id]);
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
