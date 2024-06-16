import type { Socket } from "node:net";

type DeviceType = "desktop" | "mobile";

export type Node = {
  connectionId: string;
  nodeName: string;
  deviceType: DeviceType;
};

export type Message = {
  type: "message" | "handshake" | "broadcast" | "dm";
  // biome-ignore lint/suspicious/noExplicitAny: any form of data can be passed here...
  data: Record<string, any>;
};

export type P2PMessage = Message & {
  ttl: number;
  id: string;
  origin: string;
  destination: string;
};

export type Transfer = {
  from: {
    nodeId: string;
    deviceName: string;
  };
  destination: {
    nodeId: string;
    deviceName: string;
  };
  fileName: string;
  fileType: FileTypes;
};

export type GlobalState = {
  colorMode: "dark" | "light";
  favouriteDevices: Set<Node>;
  transfers: Set<Transfer>;
  transferHistory: boolean;
  destinationPath: string|null;
  port: number;
};

export type PeerState = {
  neighbors: Map<string, Node>;
  connections: Map<string, Socket>;
  alreadySent: Set<Message>;
  applicationId: string | null;
  deviceName: string | null;
  deviceType: DeviceType;
};

export type FileTransferState = {
  files: string[];
};

export type EventTypes = {
  connect: string;
  disconnect: string;
  message: {
    connectionId: string;
    packet: Message;
  };
  broadcast: {
    nodeId: string;
    packet: Message;
  };
  dm: {
    origin: string;
    packet: Message;
  };
  "node-connect": {
    ip: string;
    port: string;
  };
  "node-disconnect": {
    nodeId: string;
  };
  "node-message": {
    nodeId: string;
    packet: Message;
  };
};

export enum FileTypes {
  MD = "md",
  TXT = "txt",
  DOCX = "docx",
}

export type FileTransfer = {
  destination: string;
  sender: {
    name: string;
    keychainID: string;
  };
  files: {
    fileName: string;
    fileType: FileTypes | null;
    buffer: Buffer;
  }[];
};
