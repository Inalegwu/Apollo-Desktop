import { TypedEventEmitter } from "@src/shared/emitter";
import type { Message, P2PMessage } from "@src/shared/types";
import { globalState$, peerState$ } from "@src/web/state";
import { Socket, createServer } from "node:net";
import { v4 } from "uuid";

type EventTypes = {
  connect: string;
  disconnect: string;
  "node-connect": {
    nodeId: string;
  };
  "node-disconnect": {
    nodeId: string;
  };
  message: {
    connectionId: string;
    message: Message;
  };
  "node-message": {
    nodeId: string | undefined;
    data: Message;
  };
  broadcast: {
    nodeId: string;
    data: Message;
  };
  dm: {
    origin: string;
    message: Message;
  };
};

const emitter = new TypedEventEmitter<EventTypes>();
const connections = peerState$.connections.get();
const neighbors = peerState$.neighbors.get();
const NODE_ID = globalState$.applicationId.get();
const NODE_NAME = globalState$.deviceName.get();
const DEVICE_TYPE = globalState$.deviceType.get();
const alreadySentMessages = peerState$.alreadySent.get();
const alreadySeenMessages = new Set();

const p2pSend = (data: P2PMessage) => {
  if (data.ttl < 1) {
    return;
  }

  if (data.type === "dm") {
    nodeSend(data.destination, {
      data: data.data,
      type: data.type,
    });
  }

  for (const $nodeId of neighbors.keys()) {
    nodeSend($nodeId, {
      data: data.data,
      type: data.type,
    });
    alreadySentMessages.add(data);
  }
};

const broadcast = (
  message: Message,
  destination: string,
  id: string = v4(),
  origin: string = NODE_ID,
  ttl = 1000,
) => {
  p2pSend({ id, ttl, origin, ...message, type: "broadcast", destination });
};

const dm = (
  message: Message,
  destination: string,
  id: string = v4(),
  origin: string = NODE_ID,
  ttl = 1000,
) => {
  p2pSend({ id, ttl, ...message, origin, type: "dm", destination });
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
    send(connectionId, {
      type: "handshake",
      data: { nodeId: NODE_ID, nodeName: NODE_NAME, deviceType: DEVICE_TYPE },
    });
  });

  emitter.on("disconnect", (connectionId) => {
    const nodeId = findNodeId(connectionId);

    if (!nodeId) {
      return;
    }

    neighbors.delete(nodeId);

    emitter.emit("node-disconnect", { nodeId });
  });

  emitter.on("message", ({ connectionId, message }) => {
    const { type, data } = message;

    if (type === "handshake") {
      const { nodeId, nodeName, deviceType } = data;

      neighbors.set(nodeId, {
        connectionId,
        nodeName,
        deviceType,
      });

      emitter.emit("node-connect", { nodeId });
    }

    if (type === "message") {
      const nodeId = findNodeId(connectionId);

      if (!nodeId) {
        console.log(`unknown node-id ${nodeId}`);
      }

      emitter.emit("node-message", { nodeId, data: message });
    }
  });

  emitter.on("node-message", ({ nodeId, data }) => {
    if (!alreadySentMessages.has(data)) {
      broadcast(
        data,
        data.data.destination,
        data.data.id,
        data.data.origin,
        data.data.ttl - 1,
      );
    }

    if (data.type === "broadcast") {
      // I've seen this before, so I've already passed it
      // on
      if (alreadySeenMessages.has(data.data.id)) {
        return;
      }

      // add this message to my already seen
      // so I wont have to broadcast it again
      alreadySeenMessages.add(data.data.id);

      emitter.emit("broadcast");
      broadcast(
        data,
        nodeId!,
        data.data.id,
        data.data.orign,
        data.data.ttl - 1,
      );
    }

    if (data.type === "dm") {
      if (data.data.destination === NODE_ID) {
        emitter.emit("dm", {
          message: data,
          origin: data.data.origin,
        });
      } else {
        dm(
          data,
          data.data.destination,
          data.data.id,
          data.data.origin,
          data.data.ttl - 1,
        );
      }
    }
  });

  socket.on("data", (data) => {
    try {
      emitter.emit("message", {
        connectionId,
        message: JSON.parse(data.toString()),
      });
    } catch (e) {
      console.error(`Cannot parse message from peer ${e}`);
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
  console.log(`Spinning up TCP server on ${opts.port}`);

  return {
    broadcast,
    dm,
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    connnect,
    start: () => {
      server.listen(opts.port);
    },
    close: (cb: () => void) => {
      console.log("Spinning down TCP server");
      server.close(cb);
    },
  };
}
