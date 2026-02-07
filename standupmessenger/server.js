const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

let users = JSON.parse(fs.readFileSync("users.json"));
let messages = JSON.parse(fs.readFileSync("messages.json"));

app.post("/register", (req, res) => {
  const { phone, password } = req.body;
  if (users.find(u => u.phone === phone)) return res.send({ error: "User exists" });
  users.push({ phone, password });
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.send({ success: true });
});

app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) return res.send({ error: "Wrong data" });
  res.send({ success: true, users });
});

io.on("connection", socket => {
  socket.on("sendMessage", msg => {
    messages.push(msg);
    fs.writeFileSync("messages.json", JSON.stringify(messages));
    io.emit("newMessage", msg);
  });
});

server.listen(3000, () => console.log("Stand Up Messenger running"));
