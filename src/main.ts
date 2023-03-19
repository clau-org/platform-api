import { mainApp } from "./routers/index.ts";
import { logger } from "./utils/logger.ts";

const port = 8000;
logger.info(`Listening on port ${port}`);

await mainApp.listen({ port });