import { publicProcedure, router } from "@src/trpc";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async ({ ctx }) => {
    ctx.node.start();
  }),
  stopNode: publicProcedure.mutation(async ({ ctx }) => {
    ctx.node.close(() => {
      console.log("Shut down node");
    });
  }),
});
