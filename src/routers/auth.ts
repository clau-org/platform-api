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

    let { name, email, phone } = ctx.state.requestData;

    let isUnique = true;
    let user = null;

    if (email) {
      user = await users.findFirst({ where: { email } });

      if (user) isUnique = false;
    }

    if (phone) {
      user = await users.findFirst({ where: { phone } });

      if (user) isUnique = false;
    }

    if (!user) {
      user = await users.create({
        data: {
          name,
          email,
          phone,
        },
      });

      logger.info("[USER CREATED]", { user });
    } else {
      logger.info("[USER ALREADY EXIST]", { user });
    }

    ctx.response.body = {
      user,
    };
  }
);

export { authRouter };
