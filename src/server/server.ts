import { RedisClientType } from "redis";
import { mongoConnect } from "../database/mongoConnection";
import{ envsRequired }from '../libs/envsRequired';
import { checkEnvs } from '../libs/checkEnvs';
import { startServer } from "../database/redisConnection";

export class Core {
    public envs: { [key in (typeof envsRequired)[number]]: string };
    public caching?: RedisClientType;
  
    private static _instance: Core;
  app: any;
    public static get intance() {
      return this._instance || (this._instance = new Core());
    }
  
    constructor() {
      this.envs = checkEnvs(process.env, envsRequired);
      this.caching = startServer(this.envs.REDIS) as any;
    }
  
    public start() {
      mongoConnect(this.envs.DATABASE);
    }
  }