import { Router } from "oak";
import { logger } from "../utils/logger.ts";
import { prisma } from "../schema/prisma.ts";

const dbRouter = new Router();

dbRouter.all("/db", async (ctx) => {
  const { users } = prisma;

  const getFakeName = async () => {
    const res = await fetch("https://api.namefake.com");
    const { name: fakeName } = await res.json();

    logger.info({ fakeName });
    return fakeName;
  };

  const fakeName: string = await getFakeName();
  const prismaResponse = await users.create({
    data: { name: fakeName },
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
