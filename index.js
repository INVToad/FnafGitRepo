import { io } from '/socket.io-client'

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

console.log('Rer')

const socket = io('https://invtoad.github.io/')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('a user connected');
});

socket.on('connection', () => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

var form = document.getElementById("form");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);
