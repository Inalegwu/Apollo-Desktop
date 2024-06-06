import { publicProcedure, router } from "@src/trpc";
import { createWriteStream, readFileSync } from "node:fs";
import { z } from "zod";
import { matchFileType } from "../utils";

function parseFilePath(path: string) {
  const matchedFileType = matchFileType(
    path.match(/\.[^/.]+$/)?.[0].split(".")[1] || "",
  );

  console.log(matchedFileType);

  return {
    fileName: "",
    fileType: matchedFileType,
    buffer: readFileSync(path),
  };
}

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
  sendFile: publicProcedure
    .input(
      z.object({
        destination: z.string(),
        filePaths: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.destination);

      const fileDataAsBuffers = input.filePaths.map((v) => parseFilePath(v));

      console.log(fileDataAsBuffers);

      createWriteStream("../../../file.md").write(fileDataAsBuffers[0].buffer);

      ctx.node.broadcast(
        {
          type: "dm",
          data: {
            destination: input.destination,
            files: fileDataAsBuffers,
          },
        },
        input.destination,
        undefined,
        ctx.node.NODE_ID,
        10000,
      );
    }),
});
