import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { nodeRouter } from "./node";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  node: nodeRouter,
});

export type AppRouter = typeof appRouter;
