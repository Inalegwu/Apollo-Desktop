import { validator } from "hono/validator";
import { z } from "zod";

// ensure the body is correct where necessary
export const bodySchema = z.object({
  nodeName: z.string(),
  nodeKeyChainId: z.string(),
});

// ensure the authorization exists on the incoming header
export const headerSchema = z.object({
  Authorization: z.string(),
});

// validate with any form of zod schema
// used below to define validators in one line
export const validateFormWithSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) =>
  validator("form", (value, c) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      return c.json({
        message: "invalid body received",
        error: parsed.error.flatten(),
      });
    }
    return parsed.data;
  });

export const validateQueryWithSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) =>
  validator("query", (value, c) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      return c.json({
        message: "invalid query params recieved",
        error: parsed.error.flatten(),
      });
    }
    return parsed.data;
  });

// validators based on schemas
export const bodyValidator = validateFormWithSchema(bodySchema);
export const headerValidator = validateFormWithSchema(headerSchema);
