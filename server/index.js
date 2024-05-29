const net = require("node:net");
const EventEmitter = require("node:events");
const { v4 } = require("uuid");

const emitter = new EventEmitter();

console.log("Starting TCP server");

const connections = new Map();

const handleNewSocket = (socket) => {
  const connectionId = v4();

  connections.set(connectionId, socket);

  emitter.emit("connect", connectionId);

  socket.on("close", () => {
    connections.delete(connectionId);
  });

  socket.on("data", (data) => {
    try {
      emitter.emit("message", {
        connectionId,
        message: JSON.parse(data.toString()),
      });
    } catch (e) {}
  });
};

const send = (connectionId, message) => {
  const socket = connections.get(connectionId);

  if (!socket) {
    throw new Error(
      `Attempting to send data to a connection that doesn't exist ${connectionId}`,
    );
  }

  socket.write(JSON.stringify(message));
};

const connect = (ip, port, cb) => {
  const socket = net.Socket();

  socket.connect(port, ip, () => {
    handleNewSocket(socket);
    cb();
  });
};

const server = net.createServer((socket) => handleNewSocket(socket));

server.listen(1000, "127.0.0.1");
