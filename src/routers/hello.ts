import { Router } from "oak";

const helloRouter = new Router();

helloRouter.all("/", (ctx) => {
  ctx.response.body = {
    message: `Hello from PLATFORM-API`,
  };
});

export { helloRouter };
