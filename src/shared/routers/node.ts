import { publicProcedure, router } from "@src/trpc";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async () => {}),
  stopNode: publicProcedure.mutation(async () => {}),
  listenOnNode: publicProcedure.subscription(async () => {}),
});
