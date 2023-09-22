export default (req, res) => {
    if (req.method === 'GET') {
    const passwords = JSON.parse(process.env.PASSWORDS || '{}');
    const cibinongPassword = passwords.cibinong || '';
  
    res.status(200).json({ password: cibinongPassword });
    }
  };
  