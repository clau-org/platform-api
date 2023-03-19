import { Router } from "oak";

const helloRouter = new Router();

helloRouter.get("/", (ctx) => {
  ctx.response.body = {
    message: `Hello from PLATFORM-API`,
  };
});

export { helloRouter };
