import { Router, Context, Status } from "oak";
import { logger } from "../utils/logger.ts";
import { validateRequest } from "../middleware/validate.ts";
import { z } from "z";
import { models } from "../schema/models.ts";
import { getFakeName } from "../tests/faker.ts";

const authRouter = new Router({
  prefix: "/auth",
});

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
    const { users } = models;

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
