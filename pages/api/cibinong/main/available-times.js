import mysql from 'mysql';
import calculateAvailableTime from './calculateAvailableTime';
import generateMessage from './generateMessage';
import connection from './db';

export default (req, res) => {
  const { tanggal } = req.query;

  const getConfigQuery = 'SELECT jam_mulai, jam_break, jam_break_akhir, jam_tutup FROM configurations';
  connection.query(getConfigQuery, (configErr, configResult) => {
    if (configErr) {
      console.error('Error fetching configuration data: ', configErr);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    } else {
      const configData = configResult[0];

      const getSpecialConfigQuery = 'SELECT jam_mulai_sp, jam_break_sp, jam_break_akhir_sp, jam_tutup_sp FROM specialconfig WHERE tanggal = ?';
      connection.query(getSpecialConfigQuery, [tanggal], (specialConfigErr, specialConfigResult) => {
        if (specialConfigErr) {
          console.error('Error fetching special configuration data: ', specialConfigErr);
          res.status(500).json({ error: 'Terjadi kesalahan pada server' });
        } else {
          const specialConfigData = specialConfigResult[0] || {};

          const checkDateQuery = 'SELECT MAX(jam) AS latest_time FROM pasien WHERE tanggal = ?';
          connection.query(checkDateQuery, [tanggal], (err, result) => {
            if (err) {
              console.error('Error saat memeriksa waktu-waktu tersedia: ', err);
              res.status(500).json({ error: 'Terjadi kesalahan pada server' });
            } else {
              const latestTime = result[0].latest_time;
              const availableTime = calculateAvailableTime(configData, specialConfigData, latestTime);

              const response = {
                availableTime: availableTime,
                breakStartTime: specialConfigData.jam_break_sp || configData.jam_break,
                breakEndTime: specialConfigData.jam_break_akhir_sp || configData.jam_break_akhir,
                maxRegistrationTime: specialConfigData.jam_tutup_sp || configData.jam_tutup,
                message: generateMessage(tanggal, availableTime, configData, specialConfigData),
              };

              res.status(200).json(response);
            }

            // Setelah semua kueri selesai, tutup koneksi
            
          });
        }
      });
    }
  });
};
