export type DeviceType = "desktop" | "mobile";

export type GlobalState = {
  deviceType: DeviceType | null;
  colorMode: "dark" | "light";
  destinationPath: string | null;
  port: number;
  deviceName: string | null;
  applicationId: string | null;
};

export enum FileTypes {
  MD = "md",
  TXT = "txt",
  DOCX = "docx",
}

export type Node = {
  deviceName: string;
  keychainId: string;
  deviceType: DeviceType;
}

export type PeerState = {
  neighbors: Map<string, Node>
  favourites: Map<string, Node>
}

export type Transfer = Readonly<{
  id: string;
  fileName: string;
  destinationDeviceName: string;
  destinationDeviceId: string;
}>