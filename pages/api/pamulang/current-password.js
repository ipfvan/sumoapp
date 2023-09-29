export default (req, res) => {
    if (req.method === 'GET') {
    const passwords = JSON.parse(process.env.PASSWORDS || '{}');
    const pamulangPassword = passwords.pamulang || '';
  
    res.status(200).json({ password: pamulangPassword });
    }
  };
  