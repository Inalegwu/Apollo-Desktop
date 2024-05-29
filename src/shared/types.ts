import type { Socket } from "node:net";

export type Node = {
  connectionId: string;
  nodeName: string;
};

export type GlobalState = {
  colorMode: "dark" | "light";
  applicationId: string | null;
  deviceName: string | null;
  deviceType: "desktop" | "mobile";
  firstLaunch: boolean;
  neighbors: Map<string, Node>;
  connections: Map<string, Socket>;
};

export type FileTransferState = {
  files: string[];
};
