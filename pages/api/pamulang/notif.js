
import { executePamulang } from '../pamulang-db'; // Sesuaikan path dengan struktur proyek Anda

const addNotification = async (notificationData) => {
  try {
    const query = 'INSERT INTO notifications (nama, jam, tanggal, tanggal_daftar) VALUES (?, ?, ?, ?)';
    const { nama, jam, tanggal, tanggal_daftar } = notificationData;
    const results = await executePamulang(query, [nama, jam, tanggal, tanggal_daftar]);
    return results;
  } catch (error) {
    console.error('Error inserting notification:', error);
    throw error;
  }
};


const getNotifications = async () => {
  try {
    const query = 'SELECT * FROM notifications';
    const results = await executePamulang(query);
    return results;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const clearAllNotifications = async () => {
  try {
    const query = 'DELETE FROM notifications';
    const results = await executePamulang(query);
    return results;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
};

const markNotificationAsViewed = async (notificationIds) => {
  try {
    const placeholders = notificationIds.map(() => '?').join(', ');
    const query = `UPDATE notifications SET isNew = 0 WHERE id IN (${placeholders})`;
    const results = await executePamulang(query, notificationIds);
    return results;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

export {
  addNotification,
  getNotifications,
  clearAllNotifications,
  markNotificationAsViewed
};
