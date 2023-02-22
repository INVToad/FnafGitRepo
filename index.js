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
    socket.emit("disconnected")
  })
  socket.on('disconnection', function(data) {
    var na = userNames[data]
    var e = CurrentUserNames.indexOf(na)
    var forgotten = CurrentUserNames.splice(e, e)
    socket.emit("disconnected", userNames[data])
    delete userNames(data)
  })
  socket.on('SentMsg', function(data, user) {
    io.sockets.emit("receiveMessage", userNames[user] + ': ' + data)
  })
  socket.on('SentConnectMsg', function(data) {
    io.sockets.emit("receiveMessage", data)
  })
})


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
  console.log("hajsk")
})