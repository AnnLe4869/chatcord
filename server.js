const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const { formatMessage } = require("./util/message/message");
const { userJoin, getRoomUsers, userLeave } = require("./util/user/user");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const BOT_NAME = "Chat bot";

// Run when client connect successfully
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    // Create a user data from socket.id and username and room
    const user = userJoin(socket.id, username, room);

    // Welcome current user to the room
    socket.join(user.room);
    socket.emit("message", formatMessage(BOT_NAME, `Welcome to Chat Cord`));
    // Notify other users about new user joining in
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(BOT_NAME, `${user.username} has joined the chat`)
      );

    // Send user room and users info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // Send user message when other users text
    socket.on("chatMessage", (message) => {
      io.to(user.room).emit("message", formatMessage(user.username, message));
    });

    // Send message to other user when current user leave
    socket.on("disconnect", () => {
      io.to(user.room).emit(
        "message",
        formatMessage(BOT_NAME, `${user.username} has left the room`)
      );
      userLeave(user.id);
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  });
});

app.use(express.static(path.join(__dirname, "/public")));

server.listen(PORT, () => console.log(`Listen to port ${PORT}`));
