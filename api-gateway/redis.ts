import { createClient } from "redis";
import { CONFIG } from "./config";

const redisClient = createClient({
  socket: {
    host: CONFIG.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

redisClient.on("error", (err: Error) =>
  console.error("Redis Client Error", err)
);

(async () => {
  await redisClient.connect();
})();

export default redisClient;
