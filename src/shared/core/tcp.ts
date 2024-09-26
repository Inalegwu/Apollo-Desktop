import type {
  ChannelTypes,
  ConnectionMessage,
  CoreResponse,
  ReceiverModeMessage,
  ServerStartResponse,
} from "@shared/core/core-message";
import { globalState$ } from "@shared/state";
import { type Socket, createServer } from "node:net";
import { parentPort } from "node:worker_threads";
import { TypedBroadCastChannel } from "./broadcast-channel";

const channel = new TypedBroadCastChannel<ChannelTypes>("core-channel");

channel.onmessage = (msg) => {
  const message = msg as MessageEvent<ChannelTypes>;
  const data = message.data;
  console.log({ data, module: "tcp-server" });

  switch (data.action) {
    case "start-server": {
      break;
    }
    case "stop-server": {
      break;
    }
    default: {
      console.log("unknown event");
    }
  }
};

const keychainId = globalState$.applicationId.get();
const nodeName = globalState$.deviceName.get();

const port = parentPort;

if (!port) throw new Error("Invalid state: No Parent port");

const handleSocket = (socket: Socket) => {
  socket.setKeepAlive(true);

  let awaitingConnection = true;

  socket.on("data", (data) => {
    try {
      const result = JSON.parse(data.toString()) as CoreResponse;

      switch (result._tag) {
        case "connect": {
          const message = result as ConnectionMessage;
          awaitingConnection = false;
          console.log("tag===connect", { message });
          channel.postMessage({ action: "start-server" });
          break;
        }
        case "receiver-mode-enable": {
          const message = result as ReceiverModeMessage;
          console.log("tag===reciever-mode-enable", { message });
          break;
        }
        case "server-start": {
          const message = result as ServerStartResponse;
          console.log("tag===server-start", { message });
          break;
        }
        default: {
          console.log("unknown _tag value");
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  setInterval(() => {
    if (awaitingConnection) {
      const payload = {
        // switch this o use application mode
        mode: "SENDER",
        nodeKeychainID: keychainId,
        nodeName,
        _tag: "connect",
        type: "CONNECTION_REQUEST",
      } as const satisfies ConnectionMessage;

      console.log("Sending payload", payload);

      socket.write(JSON.stringify(payload));
    }
  }, 3000);
};

const server = createServer(handleSocket);

port.on("message", () => {
  console.log("Starting discovery worker");
  server.listen(53317, "0.0.0.0", () => {
    console.log("server listening on port 53317");
    console.log(channel);
  });
});

port.on("close", () => server.close(console.error));
