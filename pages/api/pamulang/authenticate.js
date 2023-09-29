export default (req, res) => {
    if (req.method === 'POST') {
      const { password } = req.body;
  
      // Mengambil objek JSON dari variabel lingkungan PASSWORDS
      const passwords = JSON.parse(process.env.PASSWORDS);
  
      // Memeriksa apakah password yang diberikan sesuai dengan password1
      if (password === passwords.pamulang) {
        res.status(200).json({ message: 'Authentication successful' });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  };
  