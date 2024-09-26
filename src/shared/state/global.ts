import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { GlobalState, Node, PeerState } from "@shared/types";

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
  saveTransferHistory: false,
});

export const peerState = observable<PeerState>({
  neighbors: new Map<string, Node>(),
  favourites: new Map<string, Node>(),
});

persistObservable(globalState$, {
  local: "global_state",
});

persistObservable(peerState, {
  local: "peerState",
});
