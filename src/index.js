const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

console.log('__dirname', __dirname)

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
    console.log("user :>> ", user);
    io.sockets.emit("typing", user);
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
