import { globalState$ } from "@shared/state";
import { Hono } from "hono";
import { v4 } from "uuid";
import { sign, decode } from "hono/jwt";
import { sessions } from "@shared/storage";
import { headerValidator, bodyValidator } from "./ftp-validators";
import { serve } from "@hono/node-server";
import CORE from "@shared/core/core-message";

const neighbors = new Map<string, { name: string; keychain: string }>();

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
  sessions.setRow("sessions", sessionId, {
    sessionId,
    nodeName: body.nodeName,
    nodeKeychainId: body.nodeKeyChainId,
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

  const session = sessions.getRow("sessions", token.sessionId);
  if (!session) {
    return ctx.json({
      message: "Invalid Session ID",
      error: "invalid session id",
    });
  }
});

CORE.on("connect", ({ nodeName, nodeKeychainID, type, mode }) => {
  if (type === "CONNECTION_REQUEST" && mode === "RECEIVER") {
    const server = serve({
      fetch: app.fetch,
    });

    neighbors.set(nodeKeychainID, {
      name: nodeName,
      keychain: nodeKeychainID,
    });

    console.info({ serverAddr: server.address() });

    CORE.emit("server-start", { serverAddr: server.address.toString() });
  }

  if (type === "CONNECTION_REQUEST" && mode === "SENDER") {
    CORE.emit("receiver-mode-enable", {
      nodeName,
      nodeKeychainID,
      type: "CONNECTION_REQUEST",
    });
  }

  if (type === "CONNECTION_RESPONSE") {
    // CORE.emit()
  }
});
