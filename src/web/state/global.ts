import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { FileTransferState, GlobalState } from "@shared/types";

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const globalState$ = observable<GlobalState>({
  colorMode: "light",
  applicationId: null,
  deviceName: null,
  deviceType: "desktop",
  firstLaunch: true,
});

export const fileTransferState$ = observable<FileTransferState>({
  files: [],
});

persistObservable(globalState$, {
  local: "global_state",
});
