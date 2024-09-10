import { createServer, type Socket } from "node:net";
import CORE, {
  type CoreMessageTypes,
  type ServerStartResponse,
  type ConnectionMessage,
} from "@shared/core/core-message";
import { parentPort } from "node:worker_threads";

const port = parentPort;

if (!port) throw new Error("Invalid state: No Parent port");

const handleSocket = (socket: Socket) => {
  CORE.on("server-start", ({ serverAddr }) => {
    console.log(`Server start event sent with address ${serverAddr}`);
    socket.write(
      JSON.stringify({
        serverAddr,
      } as const satisfies ServerStartResponse),
    );
  });

  // when receiver mode is enabled, we send the required data
  // to receive the server-address
  CORE.on("receiver-mode-enable", ({ nodeName, nodeKeychainID, type }) => {
    socket.write(
      JSON.stringify({
        nodeName,
        nodeKeychainID,
        type,
        mode: "RECEIVER",
      } as const satisfies ConnectionMessage),
    );
  });

  socket.on("data", (data) => {
    try {
      const result = JSON.parse(data.toString()) as CoreMessageTypes["connect"];

      CORE.emit("connect", result);

      console.log(result);
    } catch (e) {
      console.error(e);
    }
  });
};

const server = createServer(handleSocket);

// server.listen(53317);

port.on("message", (msg) => {
  console.log("Starting discovery worker");
  server.listen(53317);
  console.log({ addr: server.address() });
});
