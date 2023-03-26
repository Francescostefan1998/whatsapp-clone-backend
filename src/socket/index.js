import express from "express";
let onlineUsers = [];
export const newConnectionHandler = (newClient) => {
  console.log("new connection", newClient.id);
  newClient.emit("welcome", { message: `Hello ${newClient.id}` });
  newClient.on("setUsername", (payload) => {
    console.log(payload);
    onlineUsers.push({ username: payload.firstName, socketId: newClient.id });
    newClient.emit("loggedIn", onlineUsers);
    newClient.broadcast.emit("updateOnlineUsers", onlineUsers);
  });
  newClient.on("sendMessage", (message) => {
    console.log("new message", message);
    newClient.broadcast.emit("newMessage", message);
  });

  newClient.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== newClient.id);
    newClient.broadcast.emit("updateOnlineUsers", onlineUsers);
  });
};
