import CORE, {
  type ConnectionMessage,
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
  socket.setKeepAlive(true, 120_000);

  CORE.on("server-start", ({ serverAddr }) => {
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
    // TODO: this section shouldbe agnostic
    // onthe message being sent
    try {
      const result = JSON.parse(data.toString());

      console.log(result);
    } catch (e) {
      console.error(e);
    }
  });

  setInterval(() => {
    const payload = {
      // switch this o use application mode
      mode: "SENDER",
      nodeKeychainID: keychainId,
      nodeName,
      _tag: "connect",
      type: "CONNECTION_REQUEST",
    } as const satisfies ConnectionMessage;

    console.log(payload);

    socket.write(JSON.stringify(payload));
  }, 4000);
};

const server = createServer(handleSocket);

port.on("message", () => {
  console.log("Starting discovery worker");
  server.listen(53317, "0.0.0.0", () => {
    console.log("server listening on port 53317");
  });
});

port.on("close", () => server.close(console.error));
