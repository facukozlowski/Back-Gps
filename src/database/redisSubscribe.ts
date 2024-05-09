import { startServer } from "../database/redisConnection";
import { RedisClientType } from "@redis/client";
import { isJSON } from "../libs/isJson";

export class SubscriptionListeners {
  private subscription: RedisClientType | null = null;
  private listeners: {
    [key: string]: (
      message: { [k: string]: unknown | undefined },
      channel: string
    ) => Promise<void>;
  } = {};
  public channels: string[] = [];
  private readonly CHANNEL_NAME = "calculous:response";

  constructor(public REDIS: string) {}

  public newChannel = async (
    channel: string,
    fn: (
      message: { [k: string]: unknown | undefined },
      channel: string
    ) => Promise<void>
  ) => {
    this.listeners[channel] = fn;
    this.channels.push(channel);

    return;
  };

  public connectSocket = async () => {
    this.subscription = (await startServer(this.REDIS)) as any;

    this.subscription!.subscribe([this.CHANNEL_NAME], async (m, c) => {
      if (!isJSON(m)) {
        console.error("FORMATO ERRONEO", m, "canal: ", c);
        return;
      }

      const json = JSON.parse(m);
      await this.listeners[c](json, c);
    });
    return;
  };
}
