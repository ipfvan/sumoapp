import { executeCiledug } from '../ciledug-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Endpoint GET
      const results = await executeCiledug('SELECT * FROM metode_sunat');
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching data from MySQL:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to insert data
    try {
      const { nama_metode } = req.body;
      const insertQuery = `INSERT INTO metode_sunat (nama_metode) VALUES (?)`;
      const values = [nama_metode];
      
      await executeCiledug(insertQuery, values);
      res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data into MySQL:', error);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
    }
  } else if (req.method === 'PUT') {
    // Handle PUT request to update data by ID
    try {
      const { id } = req.query;
      const { nama_metode } = req.body;
      const updateQuery = `UPDATE metode_sunat SET nama_metode = ? WHERE id = ?`;
      const values = [nama_metode, id];
      
      await executeCiledug(updateQuery, values);
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating data in MySQL:', error);
      res.status(500).json({ error: 'Error updating data in MySQL' });
    }
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete data by ID
    try {
      const { id } = req.query;
      const deleteQuery = `DELETE FROM metode_sunat WHERE id = ?`;
      
      await executeCiledug(deleteQuery, [id]);
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
      console.error('Error deleting data from MySQL:', error);
      res.status(500).json({ error: 'Error deleting data from MySQL' });
    }
  }
}
