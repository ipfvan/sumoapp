import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    const selectQuery = 'SELECT nama_metode FROM metode_sunat';
    connection.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching metode sunat data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        const metodeSunatOptions = results.map(result => result.nama_metode);
        res.status(200).json({ metodeSunatOptions }); // Ubah properti JSON yang dikirimkan
      }
    });
  } else {
    res.status(405).end();
  }
};
