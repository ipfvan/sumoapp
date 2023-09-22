import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    // Endpoint GET
    connection.query('SELECT * FROM metode_bius', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(200).json(results);
    });
  } else if (req.method === 'POST') {
    // Handle POST request to insert data
    const { nama_bius } = req.body;
    const insertQuery = `INSERT INTO metode_bius (nama_bius) VALUES (?)`;
    const values = [nama_bius];

    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ error: 'Error inserting data into MySQL' });
        return;
      }

      res.status(201).json({ message: 'Data inserted successfully' });
    });
  } else if (req.method === 'PUT') {
    // Handle PUT request to update data by ID
    const { id } = req.query;
    const { nama_bius } = req.body;
    const updateQuery = `UPDATE metode_bius SET nama_bius = ? WHERE id = ?`;
    const values = [nama_bius, id];

    connection.query(updateQuery, values, (error, results) => {
      if (error) {
        console.error('Error updating data in MySQL:', error);
        res.status(500).json({ error: 'Error updating data in MySQL' });
        return;
      }

      res.status(200).json({ message: 'Data updated successfully' });
    });
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete data by ID
    const { id } = req.query;
    const deleteQuery = `DELETE FROM metode_bius WHERE id = ?`;

    connection.query(deleteQuery, [id], (error, results) => {
      if (error) {
        console.error('Error deleting data from MySQL:', error);
        res.status(500).json({ error: 'Error deleting data from MySQL' });
        return;
      }

      res.status(200).json({ message: 'Data deleted successfully' });
    });
  }
};
