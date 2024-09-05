import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type {
  FileTransferState,
  GlobalState,
  Message,
  Node,
  PeerState,
  Transfer,
} from "@shared/types";
import type { Socket } from "node:net";
import { generateRandomName } from "../utils";
import { v4 } from "uuid";

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const globalState$ = observable<GlobalState>({
  colorMode: "light",
  deviceType: null,
  destinationPath: null,
  deviceName: null,
  applicationId: null,
  port: 42069,
  advancedMode: false,
});

export const fileTransferState$ = observable<FileTransferState>({
  files: [],
});

persistObservable(globalState$, {
  local: "global_state",
});
