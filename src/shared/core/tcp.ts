import CORE, {
  type ConnectionMessage,
  type CoreResponse,
  type ReceiverModeMessage,
  type ServerStartResponse,
} from "@shared/core/core-message";
import { globalState$ } from "@shared/state";
import { type Socket, createServer } from "node:net";
import { parentPort } from "node:worker_threads";

const keychainId = globalState$.applicationId.get();
const nodeName = globalState$.deviceName.get();

const port = parentPort;

if (!port) throw new Error("Invalid state: No Parent port");

const handleSocket = (socket: Socket) => {
  socket.setKeepAlive(true);

  let awaitingConnection = true;

  CORE.on("server-start", ({ serverAddr }) => {
    console.log("server-start emitted");
    console.log(`erver start event sent with address ${serverAddr}`);
    socket.write(
      JSON.stringify({
        _tag: "server-start",
        serverAddr,
      } as const satisfies ServerStartResponse),
    );
  });

  // when receiver mode is enabled we send the required data
  // to receive the server-address
  CORE.on("receiver-mode-enable", ({ nodeName, nodeKeychainID, type }) => {
    socket.write(
      JSON.stringify({
        _tag: "connect",
        nodeName,
        nodeKeychainID,
        type,
        mode: "RECEIVER",
      } as const satisfies ConnectionMessage),
    );
  });

  socket.on("data", (data) => {
    try {
      const result = JSON.parse(data.toString()) as CoreResponse;

      switch (result._tag) {
        case "connect": {
          const message = result as ConnectionMessage;
          awaitingConnection = false;
          console.log("tag===connect", { message });
          CORE.emit("connect", message);
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
  });
});

port.on("close", () => server.close(console.error));
