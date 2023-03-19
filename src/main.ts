import { mainApp } from "./routers/index.ts";
import { logger } from "./utils/logger.ts";

mainApp.addEventListener("listen", ({ port, secure }) => {
  logger.info(
    `Server started on ${secure ? "https://" : "http://"}localhost:${port}`
  );
});

const port = 8000;
await mainApp.listen({ port });
