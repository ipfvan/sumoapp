import connection from './db';



export default (req, res) => {
    if (req.method === 'GET') {
      const { startDate, endDate } = req.query;
      // ...
    } else if (req.method === 'DELETE') {
      // Assuming the endpoint URL is '/api/cibinong/main/delete-zero-barang-id'
      const queryString = 'DELETE FROM transaksi_masuk WHERE barang_id IS NULL OR barang_id = 0';
  
      connection.query(queryString, (error, results) => {
        if (error) {
          console.error('Error deleting zero barang_id data:', error);
          res.status(500).json({ error: 'An error occurred while deleting data' });
        } else {
          res.status(200).json({ message: 'Data with barang_id 0 deleted successfully' });
        }
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
