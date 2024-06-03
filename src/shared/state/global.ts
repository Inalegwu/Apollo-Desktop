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
} from "@shared/types";
import type { Socket } from "node:net";
import { generateAppId, generateRandomName } from "../utils";

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const globalState$ = observable<GlobalState>({
  colorMode: "light",
  applicationId: generateAppId(),
  deviceName: generateRandomName(),
  deviceType: "desktop",
});

export const peerState$ = observable<PeerState>({
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
