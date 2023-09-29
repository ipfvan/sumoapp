import mysql from 'mysql2/promise'; // Import mysql2 dengan mode promise

const poolpendaftaran = mysql.createPool({
 host: 'localhost',
  user: 'ipfvan',
  password: 'Mych3micalz',
  database: 'pendaftaran_db',
  waitForConnections: true,
  connectionLimit: 10, // Sesuaikan dengan kebutuhan Anda
  queueLimit: 0
});

export default poolpendaftaran;