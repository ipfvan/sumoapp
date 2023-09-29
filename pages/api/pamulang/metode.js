import { executePamulang } from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await executePamulang('SELECT * FROM metode');
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
      await executePamulang('DELETE FROM metode WHERE id = ?', [id]);
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { nama_metode, harga, fee_dr } = req.body;

    if (!nama_metode || !harga || !fee_dr) {
      res.status(400).json({ message: 'Invalid request. Missing required fields.' });
      return;
    }

    try {
      await executePamulang('INSERT INTO metode (nama_metode, harga, fee_dr) VALUES (?, ?, ?)', [nama_metode, harga, fee_dr]);
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
      case "nama_metode":
        updateQuery = `
          UPDATE metode
          SET nama_metode = ?
          WHERE id = ?;
        `;
        break;
      case "harga":
        updateQuery = `
          UPDATE metode
          SET harga = ?
          WHERE id = ?;
        `;
        break;
      case "fee_dr":
        updateQuery = `
          UPDATE metode
          SET fee_dr = ?
          WHERE id = ?;
        `;
        break;
      default:
        res.status(400).json({ error: 'Invalid column' });
        return;
    }

    try {
      await executePamulang(updateQuery, [updatedItem, itemId]);
      res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating data in database' });
    }
  } else {
    res.status(405).end();
  }
};
