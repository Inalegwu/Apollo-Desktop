import { BroadcastChannel } from "node:worker_threads";

export class TypedBroadCastChannel<
  T extends Record<string, unknown>,
> extends BroadcastChannel {
  public postMessage(message: T) {
    return super.postMessage(message);
  }
}
