const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const { formatMessage } = require("./util/message/message");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const BOT_NAME = "Chat bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    // Welcome user to the room
    socket.join(room);
    socket.emit("message", formatMessage(BOT_NAME, `Welcome to Chat Cord`));
    // Notify other users about new user joining in
    socket.broadcast
      .to(room)
      .emit(
        "message",
        formatMessage(BOT_NAME, `${username} has joined the chat`)
      );

    // Send user message when other users text
    socket.on("chatMessage", (message) => {
      io.to(room).emit("message", formatMessage(username, message));
    });

    // Send message to other user when current user leave
    socket.on("disconnect", () =>
      io
        .to(room)
        .emit(
          "message",
          formatMessage(BOT_NAME, `${username} has left the room`)
        )
    );
  });
});

app.use(express.static(path.join(__dirname, "/public")));

server.listen(PORT, () => console.log(`Listen to port ${PORT}`));
