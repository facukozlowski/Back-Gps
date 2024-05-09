import { green } from "cli-color";
import { createClient } from "redis";

export const startServer = (REDIS_URL: string) => {
  const client = createClient({ disableOfflineQueue: true, url: REDIS_URL });
  client.connect();
  client.on("error", (_err) => {});
  client.on("connect", () => console.log("Redis;", green("online")));
  client.on("end", () => console.log("error", "sin conexion a redis"));
  return client;
};
