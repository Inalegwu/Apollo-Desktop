import { publicProcedure, router } from "@src/trpc";
import startServer from "@shared/core/file-server";
import {globalState$} from "@shared/state";

export const nodeRouter = router({
    startServer:publicProcedure.mutation(async()=>startServer(globalState$.port.get())),
});
