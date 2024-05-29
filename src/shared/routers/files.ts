import { publicProcedure, router } from "@src/trpc";
import { dialog } from "electron";

export const filesRouter = router({
  selectFiles: publicProcedure.mutation(async ({ ctx }) => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      buttonLabel: "Add To Send List",
      title: "Select files or folders to send",
      defaultPath: ctx.app.getPath("documents"),
      properties: ["multiSelections", "dontAddToRecent", "openFile"],
    });

    if (canceled) {
      return {
        cancelled: true,
        data: null,
      };
    }

    console.log(filePaths);

    return {
      cancelled: false,
      data: filePaths,
    };
  }),
});
