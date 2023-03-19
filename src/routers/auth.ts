import { Router, Context, Status } from "oak";
import { logger } from "../utils/logger.ts";
import { validateRequest } from "../middleware/validate.ts";
import { z } from "z";
import { prisma } from "../schema/prisma.ts";

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
    const { users } = prisma;

    let { name = await getFakeName(), email, phone } = ctx.state.requestData;

    const user = await users.create({
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
