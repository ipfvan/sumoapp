import { executePamulang } from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { startDate, endDate } = req.query;

      // Query untuk mengambil data pasien berdasarkan tanggal
      const selectQuery = `
        SELECT * FROM pasien
        WHERE tanggal BETWEEN ? AND ?
        ORDER BY tanggal, jam
      `;

      const results = await executePamulang(selectQuery, [startDate, endDate]);
      res.status(200).json(results);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      // Query untuk menghapus data pasien berdasarkan ID
      const deleteQuery = 'DELETE FROM pasien WHERE id = ?';
      await executePamulang(deleteQuery, [id]);
      res.status(200).json({ message: 'Data pasien berhasil dihapus' });
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const formData = req.body;
      const updateQuery = `
        UPDATE pasien
        SET
          tanggal = ?,
          jam = ?,
          status = ?,
          keterangan = ?,
          nama = ?,
          usia = ?,
          orang_tua = ?,
          metode_sunat = ?,
          anatomi = ?,
          metode_bius = ?,
          no_telp = ?,
          alamat = ?,
          dokter_praktik = ?,
          goody_bag_p = ?,
          nacl_p = ?,
          butbut_p = ?,
          tumblr_p = ?,
          kaos_p = ?,
          celana_p = ?,
          nyeri_p = ?,
          antibiotik_p = ?,
          bengkak_p = ?,
          supp_p = ?,
          klamp_p = ?,
          stapler_p = ?
        WHERE id = ?
      `;

      const values = [
        formData.tanggal,
        formData.jam,
        formData.status,
        formData.keterangan,
        formData.nama,
        formData.usia,
        formData.orang_tua,
        formData.metode_sunat,
        formData.anatomi,
        formData.metode_bius,
        formData.no_telp,
        formData.alamat,
        formData.dokter_praktik,
        formData.goody_bag_p,
        formData.nacl_p,
        formData.butbut_p,
        formData.tumblr_p,
        formData.kaos_p,
        formData.celana_p,
        formData.nyeri_p,
        formData.antibiotik_p,
        formData.bengkak_p,
        formData.supp_p,
        formData.klamp_p,
        formData.stapler_p,
        formData.id
      ];

      await executePamulang(updateQuery, values);

      res.status(200).json({ message: 'Data pasien berhasil diperbarui' });
   

    } else if (req.method === 'POST') {
      const formData = req.body;
        formData.tanggal_daftar = new Date(); // Tambahkan tanggal_daftar sesuai dengan logika Anda



        const insertQuery = `
          INSERT INTO pasien (tanggal_daftar, tanggal, jam, nama, usia, orang_tua, metode_sunat, anatomi, metode_bius, no_telp, alamat, keterangan, status, dokter_praktik, goody_bag_p, nacl_p, butbut_p, tumblr_p, kaos_p, celana_p, nyeri_p, antibiotik_p, bengkak_p, supp_p, klamp_p, stapler_p)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          formData.tanggal_daftar,
          formData.tanggal,
          formData.jam,
          formData.nama,
          formData.usia,
          formData.orang_tua,
          formData.metode_sunat,
          formData.anatomi,
          formData.metode_bius,
          formData.no_telp,
          formData.alamat,
          formData.keterangan,
          formData.status,
          formData.dokter_praktik,
          formData.goody_bag_p,
          formData.nacl_p,
          formData.butbut_p,
          formData.tumblr_p,
          formData.kaos_p,
          formData.celana_p,
          formData.nyeri_p,
          formData.antibiotik_p,
          formData.bengkak_p,
          formData.supp_p,
          formData.klamp_p,
          formData.stapler_p
        ];

        await executePamulang(insertQuery, values);


        res.status(200).json({ message: 'Pendaftaran berhasil!' });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
