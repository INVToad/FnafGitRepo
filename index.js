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
  socket.on('disconnecting', function() {
    socket.rooms.forEach((value) => {
      if (value != socket.id) {
        Rooms[value] -= 1
        if (Rooms[value] == 0) {
          delete Rooms[value]
        }
      }
    })
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
      socket.to(data).emit('receiveMessage', userNames[socket.id] + ' has joined your lobby')
      Rooms[data] += 1
      socket.emit('RoomConnection', data)
      socket.emit('receiveGameData', 'LobbyLoad', Rooms[data])
      if (Rooms[data] == 4) {
        socket.to(data).emit('receiveGameData', 'GameInitiate')
        socket.emit('receiveGameData', 'GameInitiate')
      }
    } else if (!(data in Rooms)) {
      socket.join(data)
      socket.to(data).emit('receiveMessage', userNames[socket.id] + ' has joined your lobby')
      Rooms[data] = 1
      socket.emit('RoomConnection', data)
      socket.emit('receiveGameData', 'LobbyLoad', Rooms[data])
    } else {
      socket.emit('receiveMessage', 'This Room is full')
    }
  })
  socket.on('SendGameData', function(Room, type, data, data1) {
    socket.to(Room).emit('receiveGameData', type, data, data1)
  })
  socket.on('refreshRequest', function() {
    socket.emit('refreshTransmit', Rooms)
  })
  socket.on('NightSettings', function(Night) {
    if (Night == 1) {
      socket.emit('receiveGameData', 'Difficulty', {
        Motherlytronic: 0,
        PowerDraintronic: 0,
        Eyescantronic: 0,
        Electriciantronic: 5,
        FreeRoamtronic: 5,
        Phantomtronic: 0,
        Mothtronic: 5
      })
    }
    if (Night == 2) {
      socket.emit('receiveGameData', 'Difficulty', {
        Motherlytronic: 0,
        PowerDraintronic: 5,
        Eyescantronic: 0,
        Electriciantronic: 5,
        FreeRoamtronic: 8,
        Phantomtronic: 0,
        Mothtronic: 7
      })
    }
    if (Night == 3) {
      socket.emit('receiveGameData', 'Difficulty', {
        Motherlytronic: 5,
        PowerDraintronic: 8,
        Eyescantronic: 5,
        Electriciantronic: 10,
        FreeRoamtronic: 10,
        Phantomtronic: 5,
        Mothtronic: 8
      })
    }
    if (Night == 4) {
      socket.emit('receiveGameData', 'Difficulty', {
        Motherlytronic: 0,
        PowerDraintronic: 0,
        Eyescantronic: 0,
        Electriciantronic: 0,
        FreeRoamtronic: 0,
        Phantomtronic: 0,
        Mothtronic: 0
      })
    }
    if (Night == 5) {
      socket.emit('receiveGameData', 'Difficulty', {
        Motherlytronic: 0,
        PowerDraintronic: 0,
        Eyescantronic: 0,
        Electriciantronic: 0,
        FreeRoamtronic: 0,
        Phantomtronic: 0,
        Mothtronic: 0
      })
    }
    if (Night == 6) {
      socket.emit('receiveGameData', 'Difficulty', {
        Motherlytronic: 0,
        PowerDraintronic: 0,
        Eyescantronic: 0,
        Electriciantronic: 0,
        FreeRoamtronic: 0,
        Phantomtronic: 0,
        Mothtronic: 0
      })
    }
  })
});

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
  console.log("hajsk")
});