import { publicProcedure, router } from "@src/trpc";
import { globalState$ } from "@src/web/state";
import * as fs from "node:fs";
import { v4 } from "uuid";
import z from "zod";

export const nodeRouter = router({
  startNode: publicProcedure.mutation(async ({ ctx }) => {
    ctx.node.start();
  }),
  sendFile: publicProcedure
    .input(
      z.object({
        files: z.string().array(),
        destinationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const file of input.files) {
        const buffer = fs.readFileSync(file);

        ctx.node.dm(
          {
            data: buffer,
            type: "dm",
          },
          input.destinationId,
          v4(),
          globalState$.applicationId.get(),
          10000,
        );
      }
    }),
});
