import { Router } from "oak";
import { logger } from "../utils/logger.ts";
import { models } from "../schema/models.ts";
import { getFakeName } from "../tests/faker.ts";

const dbRouter = new Router();

dbRouter.all("/db", async (ctx) => {
  const { users } = models;

  const fakeName: string = await getFakeName();

  const prismaResponse = await users.create({
    data: { name: await getFakeName() },
  });

  logger.info(typeof prismaResponse);

  const result: { fakeName: string; prismaResponse: any; message: string } = {
    fakeName,
    prismaResponse,
    message: `Hello from API ${fakeName}`,
  };

  logger.info({ result });

  ctx.response.body = {
    message: `Hello from PLATFORM-API`,
    result,
  };
});

export { dbRouter };
