import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type {
  GlobalState,
} from "@shared/types";

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

persistObservable(globalState$, {
  local: "global_state",
});
