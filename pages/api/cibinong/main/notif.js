import connection from './db';

const addNotification = (notificationData) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO notifications SET ?';
    connection.query(query, notificationData, (error, results) => {
      if (error) {
        console.error('Error inserting notification:', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const getNotifications = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM notifications' ;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching notifications:', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const clearAllNotifications = () => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM notifications';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error clearing notifications:', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const markNotificationAsViewed = (notificationIds) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE notifications SET isNew = 0 WHERE id IN (?)';
      connection.query(query, [notificationIds], (error, results) => {
        if (error) {
          console.error('Error updating notification status:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  export {
    addNotification,
    getNotifications,
    clearAllNotifications,
    markNotificationAsViewed
  };