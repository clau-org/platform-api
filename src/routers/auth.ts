import { Router, Context, Status } from "oak";
import { PrismaClient } from "../schema/generated/client/deno/edge.ts";
import { logger } from "../utils/logger.ts";
import { validateRequest } from "../middleware/validate.ts";
import { z } from "z";

const CLAU_PLATFORM_PROXY_DB =
  "prisma://aws-us-east-1.prisma-data.com/?api_key=mY4engKpoOtH3QVxb9NWeTZ_NWpEeoT6CcLwsDAtpsefXTby_mpAjYXQj1qLL0yF";

const authRouter = new Router({
  prefix: "/auth",
});

const getFakeName = async () => {
  const res = await fetch("https://api.namefake.com");
  const { name: fakeName } = await res.json();
  logger.debug("[METHOD getFakeName]", { fakeName });
  return fakeName;
};

const authCreateSchema = z
  .object({
    name: z.string().nullish(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
  })
  .refine(
    (data) => {
      let isThereEmailOrPhone = !!(data.email || data.phone);
      return isThereEmailOrPhone;
    },
    {
      message: "Either email or phone must be provided",
      path: ["email", "phone"],
    }
  );

authRouter.all(
  "/create",
  validateRequest(authCreateSchema),
  async (ctx: Context) => {
    let { name = await getFakeName(), email, phone } = ctx.state.requestData;

    const prisma = new PrismaClient({
      datasources: {
        db: { url: CLAU_PLATFORM_PROXY_DB },
      },
    });

    const user = await prisma.users.create({
      data: {
        name,
        email,
        phone,
      },
    });

    logger.info("[USER CREATED]", { user });

    ctx.response.body = {
      user,
    };
  }
);

export { authRouter };
