import { executeCiledug } from '../ciledug-db'; // Sesuaikan path dengan struktur proyek Anda

      // Mulai transaksi
      export default async function handler(req, res) {
        if (req.method === 'POST') {     
          try {
            const { item, tanggal, qty, pengirim } = req.body; 
            
            const insertQuery = `
              INSERT INTO transaksi_masuk (tanggal_transaksi, barang_id, qty, pengirim)
              VALUES (?, ?, ?, ?)
            `;
      
            await executeCiledug(insertQuery, [tanggal, item, qty, pengirim]);
      
      
            res.status(200).json({ message: 'Transaksi submitted successfully' });
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
      }