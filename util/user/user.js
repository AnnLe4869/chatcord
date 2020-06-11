const users = [];

// When user join create new user object and push to users array
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// Return all users that are on same room
const getRoomUsers = (room) => users.filter((user) => user.room === room);

// Remove the user from users list when user leave
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = { userJoin, getRoomUsers, userLeave };
