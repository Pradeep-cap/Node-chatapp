const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Serve index.html file
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/socket.io/socket.io.js') {
    // Serve socket.io client script
    fs.readFile(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading socket.io.js');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Attach Socket.IO
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
