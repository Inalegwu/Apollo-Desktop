export type GlobalState = {
  colorMode: "dark" | "light";
  applicationId: string | null;
  deviceName: string | null;
};

export type FileTransferState = {
  files: string[];
};
