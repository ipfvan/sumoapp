import mysql from 'mysql2/promise'; 

import {
  addNotification,
  getNotifications,
  clearAllNotifications,
  markNotificationAsViewed
} from './notif'; // Pastikan lokasi berkas ini benar

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const notifications = await getNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Error fetching notifications' });
    }
  } else if (req.method === 'POST') {
    const notificationData = req.body;
    try {
      await addNotification(notificationData);
      res.status(200).json({ message: 'Notification inserted successfully' });
    } catch (error) {
      console.error('Error inserting notification:', error);
      res.status(500).json({ error: 'Error inserting notification' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await clearAllNotifications();
      res.status(200).json({ message: 'Notifications cleared successfully' });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      res.status(500).json({ error: 'Error clearing notifications' });
    }
  } else if (req.method === 'PUT') {
    try {
      const notificationIds = req.body.notificationIds;
      await markNotificationAsViewed(notificationIds);
      res.status(200).json({ message: 'Notifications marked as viewed' });
    } catch (error) {
      console.error('Error marking notifications as viewed:', error);
      res.status(500).json({ error: 'Error marking notifications as viewed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
