import { publicProcedure, router } from "@src/trpc";
import { utilityProcess } from "electron";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async () => {
    const proc = utilityProcess.fork("server/index.js", undefined, {
      serviceName: "Apollo Server",
    });
  }),
  listenOnNode: publicProcedure.subscription(async () => {}),
});
