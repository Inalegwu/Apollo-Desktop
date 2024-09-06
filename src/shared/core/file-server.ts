// TODO: create a simple http server where the files will
// uploaded to when a connection is established
import { globalState$ } from "@shared/state";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { v4 } from "uuid";
import { sign, decode } from "hono/jwt";
import { sessions } from "@shared/storage";

const bodySchema = z.object({
  nodeName: z.string(),
  nodeKeyChainId: z.string(),
});

const nodeName = globalState$.deviceName.get();
const keychainId = globalState$.applicationId.get();

const app = new Hono();

app.post(
  "/createSession/",
  validator("form", (value, c) => {
    const parsed = bodySchema.safeParse(value);

    if (!parsed.success) {
      return c.json({
        message: "invalid body recieved",
        error: parsed.error.flatten(),
      });
    }
    return parsed.data;
  }),
  async (ctx) => {
    const body = ctx.req.valid("form");

    const sessionId = v4();
    const token = await sign(
      {
        sessionId,
        ...body,
        exp: Math.floor(Date.now() / 1000) * 60 * 60,
      },
      keychainId,
    );

    sessions.setRow("sessions",sessionId,{
        sessionId,
        nodeName:body.nodeName,
        nodeKeychainId:body.nodeKeyChainId
    });

    return ctx.json({
      token,
      sessionId,
      status: "SUCCESS",
    });
  },
);

app.post("/upload/:sessionId", async (ctx) => {
    const session=sessions.getRow("sessions",ctx.req.param("sessionId"))
    if(!session){
        return ctx.json({
            message:"Invalid Session ID",
            error:"invalid session id"
        })
    }
});
