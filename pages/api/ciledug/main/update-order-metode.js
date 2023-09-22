import connection from './db';

export default (req, res) => {
    if (req.method === 'POST') {
      const { updatedList } = req.body;
  
      const updateOrderQuery = `
        UPDATE metode
        SET urutan = CASE id
          ${updatedList.map((item, index) => `WHEN ${item.id} THEN ${index}`).join(' ')}
        END
        WHERE id IN (${updatedList.map(item => item.id).join(',')});
      `;
  
      connection.query(updateOrderQuery, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error updating order in the database' });
        } else {
            console.log('Update successful. Affected rows:', results.affectedRows);
          res.status(200).json({ message: 'Order updated successfully' });
        }
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
  