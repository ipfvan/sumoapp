import { executeGlobal } from "../global-db";
import { executePamulang } from "../pamulang-db";

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const kategori = req.query.kategori; // Ambil kategori dari query parameter

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
            pamulang_db.transaksi_masuk
          GROUP BY
            barang_id
        ) tm ON b.id = tm.barang_id
        LEFT JOIN (
          SELECT
            barang_id,
            SUM(qty) AS total_keluar
          FROM
            pamulang_db.transaksi_keluar
          GROUP BY
            barang_id
        ) tk ON b.id = tk.barang_id
        WHERE
          b.kategori = ?;
      `;

      const results = await executeGlobal(selectQuery, [kategori]);
      res.status(200).json(results);
    } else if (req.method === 'DELETE') {
      const itemId = req.query.id; // Ambil ID item dari query parameter

      const deleteQuery = `
        DELETE FROM barang
        WHERE id = ?;
      `;

      await executeGlobal(deleteQuery, [itemId]);
      res.status(200).json({ message: 'Item deleted successfully' });
    } else if (req.method === 'PUT') {
      const itemId = req.body.id;
      const column = req.body.column;
      const updatedItem = req.body.updatedItem;

      let updateQuery;

      switch (column) {
        case 'item':
          updateQuery = `
            UPDATE barang
            SET item = ?
            WHERE id = ?;
          `;
          break;
        case 'qty':
          updateQuery = `
            UPDATE barang
            SET saldo_qty = ?
            WHERE id = ?;
          `;
          break;
        case 'satuan':
          updateQuery = `
            UPDATE barang
            SET satuan = ?
            WHERE id = ?;
          `;
          break;
        case 'expired':
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

      await executeGlobal(updateQuery, [updatedItem, itemId]);
      res.status(200).json({ message: 'Item updated successfully' });
    } else if (req.method === 'POST') {
      const kategori = req.body.kategori;
      const newItemName = req.body.item;

      const insertQuery = `
        INSERT INTO barang (kategori, item)
        VALUES (?, ?);
      `;

      await executeGlobal(insertQuery, [kategori, newItemName]);
      res.status(200).json({ message: 'Item added successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
