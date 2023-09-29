import { executeCiledug } from '../ciledug-db'; // Sesuaikan path dengan struktur proyek Anda


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Query untuk mengambil data dari tabel metode_bius
      const selectQuery = 'SELECT nama_metode FROM metode_sunat';
      const results = await executeCiledug(selectQuery);

      // Ambil nama bius dari hasil query
      const metodeSunatOptions = results.map(result => result.nama_metode);

      res.status(200).json({ metodeSunatOptions }); // Ubah properti JSON yang dikirimkan
    } catch (error) {
      console.error('Error fetching metode sunat data: ', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  } else {
    res.status(405).end();
  }
}
