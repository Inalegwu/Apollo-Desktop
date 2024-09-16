import { Collection } from "signaldb"
import {
  createLocalStorageAdapter
} from "signaldb/persistence"
import type { Transfer } from "./types";

const store = new Collection<Transfer>({
  persistence: createLocalStorageAdapter("transfer-history"),
});


export default store

