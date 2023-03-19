import { Router } from "oak";
import { logger } from "../utils/logger.ts";
import { pusher } from "../channels/pusher.ts";
import { getFakeName } from "../tests/faker.ts";

const pusherRouter = new Router();

pusherRouter.all("/pusher", async (ctx) => {
  let pResponse = null;

  try {
    let name = await getFakeName();

    const date = new Date();
    const options: any = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    };
    const mexicanDate = date.toLocaleString("es-MX", options);

    pResponse = await pusher.trigger("chat-room", "new-message", {
      message: `Hi from ${name} at ${mexicanDate}`,
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
