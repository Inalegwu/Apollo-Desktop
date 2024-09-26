// The core of message passing between the file-server
// and tcp node discovery
// CoreMessageTypes are the events that can possibly
// be sent and received on this emitter channel

type ConnectionMode = "CONNECTION_REQUEST" | "CONNECTION_RESPONSE";

export type CoreMessageTypes = Readonly<{
  connect: {
    type: ConnectionMode;
    nodeName: string;
    nodeKeychainID: string;
    mode: "RECEIVER" | "SENDER";
    _tag: "connect";
  };
  "server-start": {
    serverAddr: string;
    _tag: "server-start";
  };
  "receiver-mode-enable": {
    nodeName: string;
    nodeKeychainID: string;
    type: ConnectionMode;
    _tag: "receiver-mode-enable";
  };
}>;

export type ServerStartResponse = CoreMessageTypes["server-start"];

export type ConnectionMessage = CoreMessageTypes["connect"];

export type ReceiverModeMessage = CoreMessageTypes["receiver-mode-enable"];

export type ChannelTypes = {
  action: "start-server" | "stop-server";
};

export type CoreResponse = {
  _tag: "receiver-mode-enable" | "server-start" | "connect";
} & Record<string, unknown>;
