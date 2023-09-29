import { executeCibinong } from '../cibinong-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Endpoint GET
    try {
      const results = await executeCibinong('SELECT * FROM metode_bius');
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching data from MySQL:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to insert data
    const { nama_bius } = req.body;
    const insertQuery = `INSERT INTO metode_bius (nama_bius) VALUES (?)`;
    const values = [nama_bius];

    try {
      await executeCibinong(insertQuery, values);
      res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data into MySQL:', error);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
    }
  } else if (req.method === 'PUT') {
    // Handle PUT request to update data by ID
    const { id } = req.query;
    const { nama_bius } = req.body;
    const updateQuery = `UPDATE metode_bius SET nama_bius = ? WHERE id = ?`;
    const values = [nama_bius, id];

    try {
      await executeCibinong(updateQuery, values);
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating data in MySQL:', error);
      res.status(500).json({ error: 'Error updating data in MySQL' });
    }
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete data by ID
    const { id } = req.query;
    const deleteQuery = `DELETE FROM metode_bius WHERE id = ?`;

    try {
      await executeCibinong(deleteQuery, [id]);
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
      console.error('Error deleting data from MySQL:', error);
      res.status(500).json({ error: 'Error deleting data from MySQL' });
    }
  }
}
