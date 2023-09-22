import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    // Handle GET request to fetch data from the database
    connection.query('SELECT * FROM configurations', (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      res.status(200).json(results);
    });
  } else if (req.method === 'POST') {
    // Handle POST request to update data in the database
    const { jamMulai, jamBreak, jamBreakAkhir, jamTutup } = req.body;

    const updateQuery = `
      UPDATE configurations
      SET jam_mulai = ?, jam_break = ?, jam_break_akhir = ?, jam_tutup = ?
      WHERE id = 1; 
    `;

    connection.query(updateQuery, [jamMulai, jamBreak, jamBreakAkhir, jamTutup], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      res.status(200).json({ message: 'Configuration updated successfully' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
