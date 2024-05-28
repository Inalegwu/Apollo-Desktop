import { createStore } from "tinybase/cjs";
import { createIndexedDbPersister } from "tinybase/cjs/persisters/persister-indexed-db";

// your store/database
export const store = createStore().setTablesSchema({
  contact: {
    name: {
      type: "string",
    },
    phoneNumber: {
      type: "number",
    },
  },
});

const persister = createIndexedDbPersister(store, "electrostatic_db", 5);

persister.save();
persister.startAutoSave();
