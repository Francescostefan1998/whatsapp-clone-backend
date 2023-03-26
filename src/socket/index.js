import express from "express";

export const newConnectionHandler = (newClient) => {
  console.log("new connection", newClient.id);
  newClient.emit("welcome", { message: `Hello ${newClient.id}` });
};
