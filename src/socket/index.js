import express from "express";
let onlineUsers = [];
export const newConnectionHandler = (newClient) => {
  console.log("new connection", newClient.id);
  newClient.emit("welcome", { message: `Hello ${newClient.id}` });
  newClient.on("setUsername", (payload) => {
    console.log(payload);
    onlineUsers.push({ username: payload.username, socketId: newClient.id });
    newClient.emit("loggedIn", onlineUsers);
    newClient.broadcast.emit("updateOnlineUsers", onlineUsers);
  });
  newClient.on("sendMessage", (message) => {
    console.log("new message", message);
    newClient.broadcast.emit("newMessage", message);
  });
  newClient.on("startTyping", () => {
    const user = onlineUsers.find((user) => user.socketId === newClient.id);
    if (user) {
      newClient.broadcast.emit("userTyping", user.username);
    }
  });

  newClient.on("stopTyping", () => {
    const user = onlineUsers.find((user) => user.socketId === newClient.id);
    if (user) {
      newClient.broadcast.emit("userStoppedTyping", user.username);
    }
  });
  newClient.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== newClient.id);
    newClient.broadcast.emit("updateOnlineUsers", onlineUsers);
  });
};
