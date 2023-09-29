import { executeCibinong } from '../cibinong-db'; // Sesuaikan path dengan struktur proyek Anda


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Query untuk mengambil data dari tabel metode_bius
      const selectQuery = 'SELECT nama_bius FROM metode_bius';
      const results = await executeCibinong(selectQuery);

      // Ambil nama bius dari hasil query
      const metodeBiusOptions = results.map(result => result.nama_bius);

      res.status(200).json({ metodeBiusOptions }); // Ubah properti JSON yang dikirimkan
    } catch (error) {
      console.error('Error fetching metode bius data: ', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  } else {
    res.status(405).end();
  }
}
