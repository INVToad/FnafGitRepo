const express = require('express');
const app = express();
const http = require('http');
var CryptoJS = require("crypto-js");
const server = http.createServer(app);
var hashedKey = "244dc524b6bba33086418c1a68cb4bd95304a2562489c6c19d5c785979f48b7f";

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

app.get('/', (req, res) => {
  res.send('server');
});

var playerPos = {}

io.on('connection', async (socket) => {
  io.sockets.emit("connected")
  socket.on('disconnect', function() {
    io.sockets.emit("disconnected")

  })
})


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
  console.log("hajsk")
})