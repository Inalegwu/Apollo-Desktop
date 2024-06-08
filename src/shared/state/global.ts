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

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const globalState$ = observable<GlobalState>({
  colorMode: "light",
  favouriteDevices: new Set<Node>(),
  transfers: new Set<Transfer>(),
  transferHistory: false,
  destinationPath: "",
});

export const peerState$ = observable<PeerState>({
  applicationId: null,
  deviceName: null,
  deviceType: "desktop",
  neighbors: new Map<string, Node>(),
  connections: new Map<string, Socket>(),
  alreadySent: new Set<Message>(),
});

export const fileTransferState$ = observable<FileTransferState>({
  files: [],
});

persistObservable(globalState$, {
  local: "global_state",
});
