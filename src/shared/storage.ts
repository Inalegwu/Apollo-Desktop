import { createStore } from "tinybase/cjs";
import { createIndexedDbPersister } from "tinybase/cjs/persisters/persister-indexed-db";

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
    reciever: {
      type: "string",
    },
  },
});

const persister = createIndexedDbPersister(store, "apollo_db", 5);

persister.save();
persister.startAutoSave();
