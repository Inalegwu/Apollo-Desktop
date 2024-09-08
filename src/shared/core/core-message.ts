// The core of message passing between the file-server
// and tcp node discovery
// CoreMessageTypes are the events that can possibly
// be sent and received on this emitter channel
import { TypedEventEmitter } from "@shared/emitter";

type CoreMessageTypes = Readonly<{
  connect: {
    type: "CONNECTION_REQUEST" | "CONNECTION_RESPONSE";
    nodeName: string;
    nodeKeychainID: string;
    mode: "RECEIVER" | "SENDER";
  };
  "server-start": {
    serverAddr: string;
  };
  "receiver-mode-enable": {
    nodeName: string;
    nodeKeychainID: string;
  };
}>;

const CORE = new TypedEventEmitter<CoreMessageTypes>();

export default CORE;
