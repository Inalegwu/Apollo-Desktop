import { createServer, type Socket } from "node:net";
import dns from "node:dns";
import CORE, {
  type CoreMessageTypes,
  type ServerStartResponse,
  type ConnectionMessage,
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

// server.listen(53317);

port.on("message", (msg) => {
  console.log("Starting discovery worker");
  dns.lookup("myip.openwrt.com", (err, addr) => {
    if (err) {
      console.error("Error getting public IP", err);
      return;
    }
    console.log(addr);
    // const publicIP = addr[0];
    // console.log("Public IP", publicIP);
    server.listen(53317, addr, () => {
      console.log("Server listening on port 53317");
    });
  });
});

port.on("close", () =>
  server.close((err) => {
    console.error({ err });
  }),
);
