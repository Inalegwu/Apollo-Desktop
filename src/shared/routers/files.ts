import { publicProcedure, router } from "@src/trpc";
import { dialog } from "electron";

export const filesRouter = router({
  selectFils: publicProcedure.mutation(async ({ ctx }) => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      buttonLabel: "Add To Send List",
      title: "Select Files or Folders to Send",
      defaultPath: ctx.app.getPath("documents"),
      properties: [
        "multiSelections",
        "dontAddToRecent",
        "openFile",
        "openDirectory",
      ],
    });

    if (canceled) {
      return {
        cancelled: true,
        data: null,
      };
    }

    return {
      cancelled: false,
      data: filePaths,
    };
  }),
});
