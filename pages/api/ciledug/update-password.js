// pages/api/cibinong/update-password.js
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

export default (req, res) => {
  if (req.method === 'POST') {
    const { newPassword } = req.body;

    // Menggunakan dotenv untuk memuat variabel lingkungan dari file .env
    config();

    // Mengambil objek JSON dari variabel lingkungan PASSWORDS
    const passwords = JSON.parse(process.env.PASSWORDS);

    // Memperbarui password1 dalam objek JSON
    passwords.ciledug = newPassword;

    // Mengubah objek JSON kembali menjadi string
    const updatedPasswords = JSON.stringify(passwords);

    // Menyimpan objek JSON yang diperbarui kembali ke variabel lingkungan PASSWORDS
    process.env.PASSWORDS = updatedPasswords;

    // Simpan perubahan ke file .env
    const envFilePath = path.resolve(process.cwd(), '.env');
    const envData = `PASSWORDS=${updatedPasswords}\n`;

    fs.writeFileSync(envFilePath, envData);

    res.status(200).json({ message: 'Password updated successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
