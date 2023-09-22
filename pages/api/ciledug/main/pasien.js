import connection from './db';

export default (req, res) => {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    const selectQuery = `
    SELECT * FROM pasien
    WHERE tanggal BETWEEN ? AND ?
    ORDER BY tanggal, jam
  `;

    connection.query(selectQuery, [startDate, endDate], (err, results) => {
      if (err) {
        console.error('Error fetching data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        res.status(200).json(results);
      }
    });

  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    const deleteQuery = 'DELETE FROM pasien WHERE id = ?';
    connection.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error('Error deleting patient data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        res.status(200).json({ message: 'Data pasien berhasil dihapus' });
      }
    });

  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const updatedData = req.body;

    const updateQuery = 'UPDATE pasien SET ? WHERE id = ?';
    connection.query(updateQuery, [updatedData, id], (err) => {
      if (err) {
        console.error('Error updating patient data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        res.status(200).json({ message: 'Data pasien berhasil diperbarui' });
      }
    });
    
  } else if (req.method === 'POST') {
    const registrationData = req.body;

    const insertQuery = 'INSERT INTO pasien SET ?';
    connection.query(insertQuery, registrationData, (err) => {
      if (err) {
        console.error('Error inserting registration data: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      } else {
        res.status(200).json({ message: 'Pendaftaran berhasil' });
      }
    });
  } else {
    res.status(405).end();
  }
};
