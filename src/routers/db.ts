import { Router } from "oak";
import { PrismaClient } from "../schema/generated/client/deno/edge.ts";
import { logger } from "../utils/logger.ts";

const dbRouter = new Router();

dbRouter.all("/db", async (ctx) => {
  const CLAU_PLATFORM_PROXY_DB =
    "prisma://aws-us-east-1.prisma-data.com/?api_key=mY4engKpoOtH3QVxb9NWeTZ_NWpEeoT6CcLwsDAtpsefXTby_mpAjYXQj1qLL0yF";

  const prisma = new PrismaClient({
    datasources: {
      db: { url: CLAU_PLATFORM_PROXY_DB },
    },
  });

  const getFakeName = async () => {
    const res = await fetch("https://api.namefake.com");
    const { name: fakeName } = await res.json();

    logger.info({ fakeName });
    return fakeName;
  };

  const fakeName: string = await getFakeName();
  const prismaResponse = await prisma.users.create({
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
