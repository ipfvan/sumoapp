import mysql from 'mysql';

// Koneksi ke database ciledug_db
const cibinongConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ciledug_db', // Ganti dengan nama database Anda
});

// Koneksi ke database cibinong_db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pendaftaran_db', // Ganti dengan nama database Anda
});

export default (req, res) => {
  if (req.method === 'GET') {
    const kategori = req.query.kategori; // Assuming you're passing the category as a query parameter

    const selectQuery = `
      SELECT
          b.id,
          b.kategori,
          b.expired,
          b.satuan,
          b.urutan,
          b.item,
         COALESCE(tm.total_masuk, 0) - COALESCE(tk.total_keluar, 0) AS saldo_qty
      FROM
          barang b
      LEFT JOIN (
          SELECT
              barang_id,
              SUM(qty) AS total_masuk
          FROM
              ciledug_db.transaksi_masuk
          GROUP BY
              barang_id
      ) tm ON b.id = tm.barang_id
      LEFT JOIN (
          SELECT
              barang_id,
              SUM(qty) AS total_keluar
          FROM
              ciledug_db.transaksi_keluar
          GROUP BY
              barang_id
      ) tk ON b.id = tk.barang_id
      WHERE
          b.kategori = ?;
    `;

    connection.query(selectQuery, [kategori], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from database' });
      } else {
        res.status(200).json(results);
      }
    });
  } else if (req.method === 'DELETE') {
    const itemId = req.query.id; // Assuming you're passing the item ID as a query parameter

    const deleteQuery = `
      DELETE FROM barang
      WHERE id = ?;
    `;

    connection.query(deleteQuery, [itemId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting data from database' });
      } else {
        res.status(200).json({ message: 'Item deleted successfully' });
      }
    });
  } else if (req.method === 'PUT') {
    const itemId = req.body.id;
    const column = req.body.column;
    const updatedItem = req.body.updatedItem;

    let updateQuery;

    switch (column) {
      case "item":
        updateQuery = `
          UPDATE barang
          SET item = ?
          WHERE id = ?;
        `;
        break;
      case "qty":
        updateQuery = `
          UPDATE barang
          SET saldo_qty = ?
          WHERE id = ?;
        `;
        break;
      case "satuan":
        updateQuery = `
          UPDATE barang
          SET satuan = ?
          WHERE id = ?;
        `;
        break;
      case "expired":
        updateQuery = `
          UPDATE barang
          SET expired = ?
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
  } else if (req.method === 'POST') {
    const kategori = req.body.kategori;
    const newItemName = req.body.item;

    const insertQuery = `
      INSERT INTO barang (kategori, item)
      VALUES (?, ?);
    `;

    connection.query(insertQuery, [kategori, newItemName], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding new item to the database' });
      } else {
        res.status(200).json({ message: 'Item added successfully' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
