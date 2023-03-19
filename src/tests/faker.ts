import { logger } from "../utils/logger.ts";

async function getFakeName() {
  const res = await fetch("https://api.namefake.com");
  const { name: fakeName } = await res.json();
  logger.debug("[METHOD getFakeName]", { fakeName });
  return fakeName;
}

export { getFakeName };
