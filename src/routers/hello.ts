import { Router } from "oak";

const helloRouter = new Router();

helloRouter.get("/hello", (ctx) => {
  ctx.response.body = {
    message: `Hello from PLATFORM-API`,
  };
});

export { helloRouter };
