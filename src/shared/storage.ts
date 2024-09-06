import { createStore } from "tinybase/cjs/with-schemas";
import { createIndexedDbPersister } from "tinybase/cjs/with-schemas/persisters/persister-indexed-db";

export const store = createStore().setTablesSchema({
  sent: {
    fileName: {
      type: "string",
    },
    time: {
      type: "string",
    },
    size: {
      type: "string",
    },
    sender: {
      type: "string",
    },
    receiver: {
      type: "string",
    },
  },
});

export const sessions = createStore().setTablesSchema({
  sessions: {
    sessionId: {
      type: "string",
    },
    nodeName: {
      type: "string",
    },
    nodeKeychainId: {
      type: "string",
    },
  },
});

const persister = createIndexedDbPersister(store, "apollo_db", 5);

persister.save();
persister.startAutoSave();
