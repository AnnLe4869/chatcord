const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  //const url = socket.request.headers.referer;

  socket.broadcast.emit("message", "New user just enter chat room");

  socket.on("disconnect", () => io.emit("message", "User has leave the room"));
});

app.use(express.static(path.join(__dirname, "/public")));

server.listen(PORT, () => console.log(`Listen to port ${PORT}`));
