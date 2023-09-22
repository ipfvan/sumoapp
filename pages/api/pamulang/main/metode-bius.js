import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    const selectQuery = 'SELECT nama_bius FROM metode_bius';
    connection.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching metode bius data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        const metodeBiusOptions = results.map(result => result.nama_bius);
        res.status(200).json({ metodeBiusOptions }); // Ubah properti JSON yang dikirimkan
      }
    });
  } else {
    res.status(405).end();
  }
};
