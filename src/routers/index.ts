import { Application } from "oak";
import { helloRouter } from "./hello.ts";
import { pusherRouter } from "./pusher.ts";
import { dbRouter } from "./db.ts";

import { oakCors } from "cors";

const mainApp = new Application();

mainApp.use(oakCors());

mainApp.use(helloRouter.routes());
mainApp.use(helloRouter.allowedMethods());

mainApp.use(pusherRouter.routes());
mainApp.use(pusherRouter.allowedMethods());

mainApp.use(dbRouter.routes());
mainApp.use(dbRouter.allowedMethods());

export { mainApp };
