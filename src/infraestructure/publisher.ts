import { RedisClientType } from "redis";
import { Core } from "../server/server";

export class Publisher {
    private redis: RedisClientType = Core.intance.caching as any;
    constructor(public channel: string) {}
  
    async publish(message: { [k: string]: any }) {
      this.redis.publish(this.channel, JSON.stringify(message));
    }
  }