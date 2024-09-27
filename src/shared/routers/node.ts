import { publicProcedure, router } from "@src/trpc";
import { observable } from "@trpc/server/observable";
import type { Node } from "../types";

export const nodeRouter = router({
  // transferUpdate: publicProcedure.subscription(observable((emit) => {})),
  neighborAdded: publicProcedure.subscription(() =>
    observable<Node>((emit) => {}),
  ),
});
