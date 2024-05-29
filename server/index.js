console.log("Launching transfer server");
const net = require("node:net");

const server = net.createServer((socket) => {
  socket.write("attempting connection");
});

server.listen(4000, "127.0.0.1");

process.parentPort.on("message", (e) => {
  console.log(e.data);
});
