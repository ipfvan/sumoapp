import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    // Handle GET request to fetch data
    connection.query('SELECT * FROM specialconfig', (error, results) => {
      if (error) {
        console.error('Error fetching data from MySQL:', error);
        res.status(500).json({ error: 'Error fetching data from MySQL' });
        return;
      }

      res.status(200).json(results);
    });
  } else if (req.method === 'POST') {
    // Handle POST request to insert data
    const { tanggal, jamMulai, jamBreak, jamBreakAkhir, jamTutup } = req.body;
    const insertQuery = `INSERT INTO specialconfig (tanggal, jam_mulai_sp, jam_break_sp, jam_break_akhir_sp, jam_tutup_sp) VALUES (?, ?, ?, ?, ?)`;
    const values = [tanggal, jamMulai, jamBreak, jamBreakAkhir, jamTutup];

    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ error: 'Error inserting data into MySQL' });
        return;
      }

      res.status(201).json({ message: 'Data inserted successfully' });
    });
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete data by ID
    const { id } = req.query;
    const deleteQuery = `DELETE FROM specialconfig WHERE id = ?`;

    connection.query(deleteQuery, [id], (error, results) => {
      if (error) {
        console.error('Error deleting data from MySQL:', error);
        res.status(500).json({ error: 'Error deleting data from MySQL' });
        return;
      }

      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
