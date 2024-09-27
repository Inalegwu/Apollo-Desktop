import type {
  ConnectionMessage,
  CoreResponse,
  ReceiverModeMessage,
  ServerStartResponse,
} from "@shared/core/core-message";
import { globalState$ } from "@shared/state";
import { type Socket, createServer } from "node:net";
import { parentPort, threadId } from "node:worker_threads";
import { TypedBroadCastChannel } from "./broadcast-channel";

const channel = new TypedBroadCastChannel<CoreResponse>("core-channel");

const keychainId = globalState$.applicationId.get();
const nodeName = globalState$.deviceName.get();

const port = parentPort;

if (!port) throw new Error("Invalid state: No Parent port");

const handleSocket = (socket: Socket) => {
  socket.setKeepAlive(true);

  let awaitingConnection = true;

  // handle socket data
  socket.on("data", (data) => {
    try {
      const result = JSON.parse(data.toString()) as CoreResponse;

      switch (result._tag) {
        case "connect": {
          const message = result as ConnectionMessage;
          awaitingConnection = false;
          channel.postMessage(message);
          break;
        }
        case "receiver-mode-enable": {
          const message = result as ReceiverModeMessage;
          console.log("tag===reciever-mode-enable", { message });
          channel.postMessage(message);
          break;
        }
        case "server-start": {
          const message = result as ServerStartResponse;
          console.log("tag===server-start", { message });
          channel.postMessage(message);
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

  // handle channel messages
  channel.onmessage = (msg) => {
    const message = msg as MessageEvent<CoreResponse>;
    const data = message.data;
    console.log({ data, module: "tcp-server" });

    switch (data._tag) {
      case "connect": {
        const info = data as ConnectionMessage;
        break;
      }
      case "receiver-mode-enable": {
        const info = data as ReceiverModeMessage;
        break;
      }
      case "server-start": {
        const info = data as ServerStartResponse;
        socket.write(JSON.stringify(info satisfies ServerStartResponse));
        break;
      }
      default: {
        console.log("unknown event");
      }
    }
  };

  setInterval(() => {
    if (awaitingConnection) {
      const payload = {
        // switch this o use application mode
        mode: "SENDER",
        nodeKeychainID: keychainId,
        nodeName,
        deviceType: globalState$.deviceType.get(),
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
  server.listen(53317, "0.0.0.0", () => {
    console.log({ message: "discovery worker started", worker: threadId });
    console.log(channel);
  });
});

port.on("close", () => server.close(console.error));
