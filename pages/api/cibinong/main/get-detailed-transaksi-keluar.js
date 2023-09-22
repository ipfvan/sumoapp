import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    // Query to get combined data by grouping and summing the quantities
    const queryString = `
      SELECT tanggal_transaksi, barang_id, SUM(qty) AS total_qty
      FROM transaksi_keluar
      WHERE tanggal_transaksi BETWEEN ? AND ?
      GROUP BY tanggal_transaksi, barang_id
    `;

    connection.query(queryString, [startDate, endDate], (error, results) => {
      if (error) {
        console.error('Error fetching combined transaksi by date range:', error);
        res.status(500).json({ error: 'An error occurred while fetching combined transactions' });
      } else {
        res.status(200).json(results);
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
