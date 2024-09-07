import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { filesRouter } from "./files";
import { nodeRouter } from "./node";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  node: nodeRouter,
  files: filesRouter,
  platform:publicProcedure.query(()=>{
    return process.platform
  })
});

export type AppRouter = typeof appRouter;
