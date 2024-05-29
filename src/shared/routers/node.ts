import { publicProcedure, router } from "@src/trpc";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async ({ ctx }) => {
    ctx.node.start();
  }),
});
