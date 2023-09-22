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

  socket.on('playAudio', () => {
    io.emit('startAudio'); // Broadcast command to start audio
  });

  socket.on('stopAudio', () => {
    io.emit('stopAudio'); // Broadcast command to stop audio
  });

  socket.on('playAudio2', () => {
    io.emit('startAudio2'); // Broadcast command to start audio
  });

  socket.on('stopAudio2', () => {
    io.emit('stopAudio2'); // Broadcast command to stop audio
  });

  socket.on('playAudio3', () => {
    io.emit('startAudio3'); // Broadcast command to start audio
  });

  socket.on('stopAudio3', () => {
    io.emit('stopAudio3'); // Broadcast command to stop audio
  });


  socket.on('disconnect', () => {
    console.log('User disconnected');
    
  });
  socket.on('newPatientRegistered', (patientData) => {
    io.emit('newPatientLog', patientData); // Broadcast patient registration log
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
