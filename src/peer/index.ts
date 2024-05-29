import { globalState$ } from "@src/web/state";
import EventEmitter from "node:events";
import { Socket, createServer } from "node:net";
import { v4 } from "uuid";

const emitter = new EventEmitter();
const connections = globalState$.connections.get();
const neighbors = globalState$.neighbors.get();
const NODE_ID = globalState$.applicationId.get();
const alreadySentMessages = new Set();

type Message = {
  type: "message" | "handshake" | "broadcast" | "dm";
  data: unknown;
};

type P2PMessage = Message & {
  ttl: number;
  id: string;
  origin: string;
};

const p2pSend = (data: P2PMessage) => {
  if (data.ttl < 1) {
    return;
  }

  for (const $nodeId of neighbors.keys()) {
    nodeSend($nodeId, data);
    alreadySentMessages.add(data.id);
  }
};

const broadcast = (
  message: Message,
  id: string = v4(),
  origin: string = NODE_ID,
  ttl = 1000,
) => {
  p2pSend({ id, ttl, origin, ...message, type: "broadcast" });
};

const dm = (
  message: Message,
  id: string = v4(),
  origin: string = NODE_ID,
  ttl = 1000,
) => {
  p2pSend({ id, ttl, ...message, origin, type: "dm" });
};

const findNodeId = (connectionId: string) => {
  for (const [nodeId, node] of neighbors) {
    if (connectionId === node.connectionId) {
      return nodeId;
    }
  }
};

const nodeSend = (nodeId: string, data: Message) => {
  const node = neighbors.get(nodeId);

  if (!node) {
    return;
  }

  send(node.connectionId, {
    type: "message",
    data,
  });
};

const handleNewSocket = (socket: Socket) => {
  const connectionId = v4();

  connections.set(connectionId, socket);
  emitter.emit("connect", connectionId);

  socket.on("close", () => {
    connections.delete(connectionId);
    emitter.emit("disconnect", connectionId);
  });

  emitter.on("connect", (connectionId) => {
    send(connectionId, { type: "handshake", data: { nodeId: NODE_ID } });
  });

  emitter.on("disconnect", (connectionId) => {
    const node = findNodeId(connectionId);

    if (!node) {
      return;
    }

    neighbors.delete(node);

    emitter.emit("node-disconnect", { node });
  });

  emitter.on("message", ({ connectionId, nodeName, message }) => {
    const { type, data } = message;

    if (type === "handshake") {
      const { nodeId } = data;

      neighbors.set(nodeId, {
        connectionId,
        nodeName,
      });

      emitter.emit("node-connect", { nodeId });
    }

    if (type === "message") {
      const nodeId = findNodeId(connectionId);

      if (!nodeId) {
      }

      emitter.emit("node-message", { nodeId, data });
    }
  });

  emitter.on("node-message", ({ nodeId, data }) => {
    if (!alreadySentMessages.has(data.id)) {
      broadcast(data.message, data.id, data.origin, data.ttl - 1);
    }
  });

  socket.on("data", (data) => {
    try {
      emitter.emit("message", {
        connectionId,
        message: JSON.parse(data.toString()),
      });
    } catch (e) {
      // console.error(`Cannot parse message from peer`, data.toString())
    }
  });
};

const send = (connectionId: string, message: Message) => {
  const socket = connections.get(connectionId);

  if (!socket) {
    throw new Error(
      `Attempting to send data to connection that doesn't exist ${connectionId}`,
    );
  }

  socket.write(JSON.stringify(message));
};

const connnect = (ip: string, port: number, cb: () => void) => {
  const socket = new Socket();

  socket.connect(port, ip, () => {
    handleNewSocket(socket);
    cb();
  });
};

const server = createServer((socket) => handleNewSocket(socket));

export default function createP2PNode(opts: {
  port: number;
}) {
  console.log(`Launching TCP server on ${opts.port}`);

  return {
    broadcast,
    dm,
    on: emitter.on,
    connnect,
    start: () => {
      server.listen(opts.port);
    },
    close: (cb: () => void) => {
      server.close(cb);
    },
  };
}
