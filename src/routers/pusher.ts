import { Router } from "oak";
import Pusher from "pusher";
import { logger } from "../utils/logger.ts";

const pusher = new Pusher({
  appId: "8d9106b8-6172-4f92-99cc-f6f8d8845e44",
  key: "8efe3b5d-d99f-4e67-b1e9-39c8e3c49774",
  secret: "uORKo0ZKgjDTYepV4YjvkXdquo96oCtb",
  useTLS: true,
  host: "clau-platform-6a998e8f-4990-48ac-9304-5c5b98f6d694.fro-dev-clau.workers.dev",
  port: "443",
  cluster: "",
});

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
