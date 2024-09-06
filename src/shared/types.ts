export type DeviceType = "desktop" | "mobile";

export type GlobalState = {
  deviceType: DeviceType | null;
  colorMode: "dark" | "light";
  destinationPath: string | null;
  port: number;
  deviceName: string | null;
  applicationId: string | null;
  advancedMode: boolean;
};

export enum FileTypes {
  MD = "md",
  TXT = "txt",
  DOCX = "docx",
}
