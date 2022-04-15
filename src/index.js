const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require("dotenv");

dotenv.config();
app.use(express.static(__dirname + "/public"));

console.log("NODE_ENV", process.env.NODE_ENV);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  socket.emit("connected-user", {
    username: null,
    id: socket.id,
  });
  socket.on("send-message", (data) => {
    io.sockets.emit("new-message", data);
  });
  socket.on("typing", (user) => {
    socket.broadcast.emit("typing", user);
  });
});
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
