import connection from './db';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM dokter', (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ message: 'Invalid request. Missing id parameter.' });
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        connection.query('DELETE FROM dokter WHERE id = ?', [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { nama, no_telp, alamat } = req.body;

    if (!nama || !no_telp || !alamat) {
      res.status(400).json({ message: 'Invalid request. Missing required fields.' });
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        connection.query('INSERT INTO dokter(nama, no_telp, alamat) VALUES (?, ?, ?)', [nama, no_telp, alamat], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      res.status(201).json({ message: 'Inserted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
} else if (req.method === 'PUT') {
    const itemId = req.body.id;
    const column = req.body.column;
    const updatedItem = req.body.updatedItem;

    let updateQuery;

    switch (column) {
      case "nama":
        updateQuery = `
          UPDATE dokter
          SET nama = ?
          WHERE id = ?;
        `;
        break;
      case "no_telp":
        updateQuery = `
          UPDATE dokter
          SET no_telp = ?
          WHERE id = ?;
        `;
        break;
      case "alamat":
        updateQuery = `
          UPDATE dokter
          SET alamat = ?
          WHERE id = ?;
        `;
        break;
      default:
        res.status(400).json({ error: 'Invalid column' });
        return;
    }

    connection.query(updateQuery, [updatedItem, itemId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating data in database' });
      } else {
        res.status(200).json({ message: 'Item updated successfully' });
      }
    });
  } else {
    res.status(405).end();
  }
};
