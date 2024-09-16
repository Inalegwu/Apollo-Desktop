import { createServer, type Socket } from "node:net";
import CORE, {
  type ConnectionMessage,
  type CoreMessageTypes,
  type ServerStartResponse,
} from "@shared/core/core-message";
import { parentPort } from "node:worker_threads";
import { globalState$ } from "@shared/state";

const keychainId = globalState$.applicationId.get();
const nodeName = globalState$.deviceName.get();

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

  setInterval(() => {
    console.log("Attempting to connect");

    const payload = {
      // switch this to use application mode
      mode: "SENDER",
      nodeKeychainID: keychainId,
      nodeName,
      type: "CONNECTION_REQUEST",
    } as const satisfies ConnectionMessage;

    console.log(payload);

    socket.write(JSON.stringify(payload));
  }, 3500);
};

const server = createServer(handleSocket);

port.on("message", () => {
  console.log("Starting discovery worker");
  server.listen(53317, "0.0.0.0", () => {
    console.log("server listening on port 53317");
  });
});

port.on("close", () =>
  server.close((err) => {
    console.error({ err });
  }),
);
