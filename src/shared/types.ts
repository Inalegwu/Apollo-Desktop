export type GlobalState = {
  colorMode: "dark" | "light";
  applicationId: string | null;
  deviceName: string | null;
  deviceType: "desktop" | "mobile";
  firstLaunch: boolean;
};

export type FileTransferState = {
  files: string[];
};
