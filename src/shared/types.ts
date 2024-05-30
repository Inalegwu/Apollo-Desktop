import type { Socket } from "node:net";

type DeviceType = "desktop" | "mobile";

export type Node = {
  connectionId: string;
  nodeName: string;
  deviceType: DeviceType;
};

export type GlobalState = {
  colorMode: "dark" | "light";
  applicationId: string | null;
  deviceName: string | null;
  deviceType: DeviceType;
  firstLaunch: boolean;
};

export type PeerState = {
  neighbors: Map<string, Node>;
  connections: Map<string, Socket>;
};

export type FileTransferState = {
  files: string[];
};
