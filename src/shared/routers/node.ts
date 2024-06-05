import { publicProcedure, router } from "@src/trpc";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async ({ ctx }) => {
    ctx.node.start();

    return {
      name: ctx.node.NODE_NAME,
      id: ctx.node.NODE_ID,
    };
  }),
  stopNode: publicProcedure.mutation(async ({ ctx }) => {
    ctx.node.close(() => {
      console.log("Shut down node");
    });
  }),
});
