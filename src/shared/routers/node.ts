import { publicProcedure, router } from "@src/trpc";
import { utilityProcess } from "electron";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async ({ ctx }) => {
    const proc = utilityProcess.fork("server/index.js");

    proc.postMessage({ state: "start" });

    return proc;
  }),
});
