const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// joinRoom event
socket.emit("joinRoom", { username, room });

// When user submit the message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get the text content
  const message = e.target.elements.msg.value;
  // Send the message to server
  socket.emit("chatMessage", message);
  // Reset the input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// message event
// Display message and scroll to the latest one
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// roomUsers event
// Display room name and list of users in room
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Add a text message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

// Display the room name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

// Add users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
};
