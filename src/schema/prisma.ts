import { PrismaClient } from "./generated/client/deno/edge.ts";

const CLAU_PLATFORM_PROXY_DB =
  "prisma://aws-us-east-1.prisma-data.com/?api_key=mY4engKpoOtH3QVxb9NWeTZ_NWpEeoT6CcLwsDAtpsefXTby_mpAjYXQj1qLL0yF";

const prisma = new PrismaClient({
  datasources: {
    db: { url: CLAU_PLATFORM_PROXY_DB },
  },
});

export { prisma };
