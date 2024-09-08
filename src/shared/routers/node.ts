import { publicProcedure, router } from "@src/trpc";
import { globalState$ } from "@shared/state";

export const nodeRouter = router({
  // transferUpdate: publicProcedure.subscription(observable((emit) => {})),
});
