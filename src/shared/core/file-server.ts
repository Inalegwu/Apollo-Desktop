import { serve } from "@hono/node-server";
import CORE from "@shared/core/core-message";
import { globalState$, peerState } from "@shared/state";
import { sessions } from "@shared/storage";
import { Hono } from "hono";
import { decode, sign } from "hono/jwt";
import { v4 } from "uuid";
import { bodyValidator, headerValidator } from "./ftp-validators";

const neighbors = peerState.neighbors.get();

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

CORE.on("connect", ({ nodeName, nodeKeychainID, type, mode }) => {
  console.log("connect message recieved");
  if (type === "CONNECTION_REQUEST" && mode === "RECEIVER") {
    const server = serve({
      fetch: app.fetch,
    });

    neighbors.set(nodeKeychainID, {
      deviceName: nodeName,
      keychainId: nodeKeychainID,
      deviceType: globalState$.deviceType.get(),
    });

    console.info({ serverAddr: server.address() });

    CORE.emit("server-start", {
      serverAddr: server.address.toString(),
      _tag: "server-start",
    });
  }

  if (type === "CONNECTION_REQUEST" && mode === "SENDER") {
    CORE.emit("receiver-mode-enable", {
      nodeName,
      nodeKeychainID,
      type: "CONNECTION_REQUEST",
      _tag: "receiver-mode-enable",
    });
  }

  if (type === "CONNECTION_RESPONSE") {
    // CORE.emit()
  }
});
