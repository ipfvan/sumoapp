export default (req, res) => {
    if (req.method === 'GET') {
    const passwords = JSON.parse(process.env.PASSWORDS || '{}');
    const ciledugPassword = passwords.ciledug || '';
  
    res.status(200).json({ password: ciledugPassword });
    }
  };
  