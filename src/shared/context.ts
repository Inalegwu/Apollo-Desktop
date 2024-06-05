import type { inferAsyncReturnType } from "@trpc/server";
import { BrowserWindow, app } from "electron";
import createP2PNode from "./peer";
import { store } from "./storage";

export async function createContext() {
  const browserWindow = BrowserWindow.getFocusedWindow();

  const node = createP2PNode();

  return {
    window: browserWindow,
    store,
    app,
    node,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
