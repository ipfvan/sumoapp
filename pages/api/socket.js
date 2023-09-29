// api/socket.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Inisialisasi server HTTP
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});

// Inisialisasi server WebSocket
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this to restrict origins if needed
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendNotification', (notificationData) => {
    io.emit('sendNotification', notificationData);
    console.log('Pesan notifikasi diterima dari regis.js dan disiarkan ke semua klien.'); // Broadcast patient registration log
  });

  socket.on('sendNotification2', (notificationData) => {
    io.emit('sendNotificatio2', notificationData);
    console.log('Pesan notifikasi diterima dari regis.js dan disiarkan ke semua klien.');
 // Broadcast patient registration log
  });

  socket.on('sendNotification3', (notificationData) => {
    io.emit('sendNotification3', notificationData);
    console.log('Pesan notifikasi diterima dari regis.js dan disiarkan ke semua klien.'); // Broadcast patient registration log
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
    
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
