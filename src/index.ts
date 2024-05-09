import dotenv from 'dotenv';
import { Core } from '../src/server/server';
import { SubscriptionListeners } from './database/redisSubscribe';
import{ server, wss } from './app'; 
import { mongoConnect } from '../src/database/mongoConnection';

dotenv.config();

const PORT = 4000;

mongoConnect(process.env.MONGODB_URI!);

wss.on('listening', () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});


server.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});

const redisSubscribe = new SubscriptionListeners(process.env.REDIS!);
Core.intance

setTimeout(()=>{

  redisSubscribe.newChannel("calculous:response", async (message, channel) => {
    if (!(await Core.intance.caching?.exists(`calculous:response:${message.idSocket}`))) {
      Core.intance.caching?.hSet(`calculous:response:${message.idSocket}`, message as any);
      console.log(message, 'recibo de redis:');
      return;
    }
  });
},1000)

redisSubscribe.connectSocket();

