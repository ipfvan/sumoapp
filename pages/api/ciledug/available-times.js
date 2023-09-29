import { executeCiledug } from '../ciledug-db';
import calculateAvailableTime from './calculateAvailableTime';
import generateMessage from './generateMessage';

export default async function handler(req, res) {
  const { tanggal } = req.query;

  try {
    // Query untuk mengambil data konfigurasi
    const getConfigQuery = 'SELECT jam_mulai, jam_break, jam_break_akhir, jam_tutup FROM configurations';
    const configData = await executeCiledug(getConfigQuery);

    // Query untuk mengambil data konfigurasi khusus berdasarkan tanggal
    const getSpecialConfigQuery = 'SELECT jam_mulai_sp, jam_break_sp, jam_break_akhir_sp, jam_tutup_sp FROM specialconfig WHERE tanggal = ?';
    const specialConfigData = await executeCiledug(getSpecialConfigQuery, [tanggal]);

    // Query untuk memeriksa waktu terakhir dari tabel pasien
    const checkDateQuery = 'SELECT MAX(jam) AS latest_time FROM pasien WHERE tanggal = ?';
    const latestTimeResult = await executeCiledug(checkDateQuery, [tanggal]);
    const latestTime = latestTimeResult[0].latest_time;

    // Hitung waktu yang tersedia
    const availableTime = calculateAvailableTime(configData[0], specialConfigData[0] || {}, latestTime);

    // Buat respons JSON
    const response = {
      availableTime: availableTime,
      breakStartTime: specialConfigData[0]?.jam_break_sp || configData[0].jam_break,
      breakEndTime: specialConfigData[0]?.jam_break_akhir_sp || configData[0].jam_break_akhir,
      maxRegistrationTime: specialConfigData[0]?.jam_tutup_sp || configData[0].jam_tutup,
      message: generateMessage(tanggal, availableTime, configData[0], specialConfigData[0] || {}),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
