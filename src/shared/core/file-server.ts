import type {
  ConnectionMessage,
  CoreResponse,
  ReceiverModeMessage,
  ServerStartResponse,
} from "@shared/core/core-message";
import { globalState$ } from "@shared/state";
import { sessions } from "@shared/storage";
import { Hono } from "hono";
import { decode, sign } from "hono/jwt";
import { parentPort, threadId } from "node:worker_threads";
import { v4 } from "uuid";
import { TypedBroadCastChannel } from "./broadcast-channel";
import { bodyValidator, headerValidator } from "./ftp-validators";

const channel = new TypedBroadCastChannel<CoreResponse>("core-channel");

// const neighbors = peerState.neighbors.get();

const EXP_TIME = Math.floor(Date.now() * 1000) * 60 * 60;

type JwtPayload = {
  sessionId: string;
  nodeName: string;
  nodeKeyChainId: string;
  exp: number;
};

const keychainId = globalState$.applicationId.get();

const app = new Hono();

// handle create a session for the incoming
// node
app.post("/createSession/", bodyValidator, async (ctx) => {
  const body = ctx.req.valid("form");

  // a unique identifier for a session
  // this ensures sessions and files don't class when being handled
  const sessionId = v4();

  // the data being encoded into the jwt
  const payload = {
    sessionId,
    ...body,
    exp: EXP_TIME,
  } as const satisfies JwtPayload;

  //  JWT, used to ensure only authorized nodes can
  // upload to this server, so url leaking won't matter
  const token = await sign(payload, keychainId);

  // persist session to store so we can access and
  // verify it anywhere
  sessions.insert({
    id: sessionId,
    nodeName: body.nodeName,
    nodeKeychainID: body.nodeKeyChainId,
  });

  return ctx.json({
    token,
    sessionId,
    status: "SUCCESS",
  });
});

app.post("/upload/", headerValidator, async (ctx) => {
  const { Authorization: tkn } = ctx.req.valid("form");

  const token = decode(tkn).payload as JwtPayload;

  console.log({ message: "found token", token });

  const session = sessions
    .find({
      id: token.sessionId,
    })
    .fetch()[0];

  if (!session) {
    return ctx.json({
      message: "Invalid Session ID",
      error: "invalid session id",
    });
  }

  console.log({ session });
});

const port = parentPort;

if (!port) throw new Error("Invalid state: No Parent port");

channel.onmessage = (msg) => {
  const message = msg as MessageEvent<CoreResponse>;
  const data = message.data;
  switch (data._tag) {
    case "server-start": {
      // the file-server shouldn't handle this response
      // since it will never get this response
      break;
    }
    case "connect": {
      const info = data as ConnectionMessage;

      console.log("attempting to add new neighbor");

      console.log({ info });

      channel.postMessage({
        _tag: "server-start",
        serverAddr: "0",
      } satisfies ServerStartResponse);

      break;
    }
    case "receiver-mode-enable": {
      const info = data as ReceiverModeMessage;
      break;
    }
  }
};

port.on("message", () => {
  console.log({ message: "file server worker started", worker: threadId });
});
