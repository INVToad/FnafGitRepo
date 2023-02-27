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

var userNames = {}
var CurrentUserNames = []
var Rooms = {}

io.on('connection', async (socket) => {
  socket.on('connect', function() { })
  socket.on('connected', function(arg1, arg2) {
    if (CurrentUserNames.includes(arg1)) {
      socket.emit('user', 'Taken', arg1)
    } else {
      CurrentUserNames.push(arg1)
      userNames[arg2] = arg1
      socket.emit("connected", userNames[arg2])
    }
  })
  socket.on('disconnect', function() {
    var na = userNames[socket.id]
    var e = CurrentUserNames.indexOf(na)
    var forgotten = CurrentUserNames.splice(e, e)
    io.sockets.emit("disconnected", userNames[socket.id])
    delete userNames[socket.id]
  })
  socket.on('SentMsg', function(data, user) {
    io.sockets.emit("receiveMessage", userNames[user] + ': ' + data)
  })
  socket.on('SentConnectMsg', function(data) {
    io.sockets.emit("receiveMessage", data)
  })
  socket.on('JoinRoom', function(data) {
    if (data in Rooms && Rooms[data] < 4) {
      socket.join(data)
      socket.to(data).emit('receiveMessage', socket.id + ' had joined')
      Rooms[data] += 1
      socket.emit('RoomConnection', data)
    } else if (!(data in Rooms)) {
      socket.join(data)
      socket.to(data).emit('receiveMessage', socket.id + ' had joined')
      Rooms[data] = 1
      socket.emit('RoomConnection', data)
    } else {
      socket.emit('receiveMessage', 'This Room is full')
    }
  })
  socket.on('SendGameData', function(Room, type, data) {
    socket.to(Room).emit('receiveGameData', type, data)
  })
});

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
  console.log("hajsk")
});