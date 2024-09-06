import { globalState$ } from "@shared/state";
import { Hono } from "hono";
import { v4 } from "uuid";
import { sign, decode } from "hono/jwt";
import { sessions } from "@shared/storage";
import { headerValidator, bodyValidator } from "./ftp-validators";

const EXP_TIME = Math.floor(Date.now() * 1000) * 60 * 60;

type JwtPayload = {
  sessionId: string;
  nodeName: string;
  nodeKeyChainId: string;
  exp: number;
};

const nodeName = globalState$.deviceName.get();
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
  } satisfies JwtPayload;

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

  const session = sessions.getRow("sessions", token.sessionId);
  if (!session) {
    return ctx.json({
      message: "Invalid Session ID",
      error: "invalid session id",
    });
  }
});
