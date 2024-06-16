import { publicProcedure, router } from "@src/trpc";
import { dialog } from "electron";
import * as fs from "node:fs";

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

    return {
      cancelled: false,
      data: filePaths,
    };
  }),
  defineDestination:publicProcedure.mutation(async({ctx})=>{
    const path=`${ctx.app.getPath("downloads")}/Apollo`;

    fs.mkdir(path,(err)=>{
      console.error(err)
    })

    return {
      path:`${ctx.app.getPath("downloads")}/Apollo`
    }
  }),
  changeDestination:publicProcedure.mutation(async({ctx})=>{
     const { filePaths, canceled } = await dialog.showOpenDialog({
      buttonLabel: "Select Destination Folder",
      title: "Select Destination",
      defaultPath: `${ctx.app.getPath("downloads")}${process.platform==="win32"?"\\":"/"}Apollo`,
      properties: ["openDirectory"],
    });

    if(canceled) {
      return {
        cancelled:true,
        path:null
      }
    }

    return {
      cancelled:false,
      path:filePaths[0]
    }
  })
});
