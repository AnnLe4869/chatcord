const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

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
});

// Display message when current user or other user submit text
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Function to add a text message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};
