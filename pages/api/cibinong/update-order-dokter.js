import { executeCibinong } from '../cibinong-db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { updatedList } = req.body;

      // Membuat query untuk mengganti urutan data dalam tabel "barang"
      const updateOrderQuery = `
        UPDATE dokter
        SET urutan = CASE id
          ${updatedList.map((item, index) => `WHEN ${item.id} THEN ${index}`).join(' ')}
        END
        WHERE id IN (${updatedList.map(item => item.id).join(',')});
      `;

      // Eksekusi query menggunakan fungsi executeCibinong
      const results = await executeCibinong(updateOrderQuery);

      // Kirim respons sukses jika query berhasil
      res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error updating order in the database' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}