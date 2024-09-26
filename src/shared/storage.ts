import { Collection, createLocalStorageAdapter } from "signaldb";
import type { Session, Transfer } from "./types";

const store = new Collection<Transfer>({
  persistence: createLocalStorageAdapter("transfer-history"),
});

export const sessions = new Collection<Session>();

export default store;
