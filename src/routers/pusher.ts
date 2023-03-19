import { Router } from "oak";
import { logger } from "../utils/logger.ts";
import { pusher } from "../channels/pusher.ts";

const pusherRouter = new Router();

pusherRouter.all("/pusher", async (ctx) => {
  let pResponse = null;

  try {
    pResponse = await pusher.trigger("chat-room", "new-message", {
      message: "Ey, it seems the implementation works! :) - DENO!",
    });

    pResponse = await pResponse.json();
    logger.info({ pResponse });
  } catch (error) {
    pResponse = error;
    logger.error({ pResponse });
  }

  ctx.response.body = {
    pResponse,
  };
});

export { pusherRouter };
