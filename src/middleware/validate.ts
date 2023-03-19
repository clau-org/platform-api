import { Context } from "oak";
import { getQuery } from "oak/helpers";
import { ZodError } from "z";
import { logger } from "../utils/logger.ts";

interface ValidationError {
  errors: { message: string }[];
}

function validateRequest(schema?: any) {
  const middleware: any = async (
    ctx: Context,
    next: () => Promise<void>
  ): Promise<any> => {
    try {
      ctx.state.requestData = {};

      let body = await ctx.request.body().value;
      let bodyUrl = Object.fromEntries(body?.entries?.() || []);
      let query = getQuery(ctx);

      logger.debug("[ORIGINAL DATA]", { body, bodyUrl, query });

      // Clear body if body is URL encoded
      if (Object.keys(bodyUrl).length > 0) body = {};

      const data = {
        ...body,
        ...bodyUrl,
        ...query,
      };

      logger.debug("[DATA BEFORE VALIDATION]", data);

      if (schema) schema.parse(data);

      logger.debug("[DATA AFTER VALIDATION]", data);

      ctx.state.requestData = data;

      await next();

    } catch (error) {
      if (error instanceof ZodError) {
        const validationError: ValidationError = {
          errors: error.errors.map((err: { message: any }) => ({
            message: err.message,
          })),
        };
        ctx.response.status = 400;
        ctx.response.body = validationError;
      } else {
        throw error;
      }
    }
  };

  return middleware;
}

export { validateRequest };
