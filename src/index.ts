import dotenv from 'dotenv';
import { Core } from '../src/server/server';
import { SubscriptionListeners } from './database/redisSubscribe';
import{ server, wss } from './app'; 
import { mongoConnect } from '../src/database/mongoConnection';
import { webSocketResponse } from './schemas/data.model';

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
    let objetoVariable: webSocketResponse = {
    idSocket: message.idSocket as any,
    HoraPuntoDePaso: message.HoraPuntoDePaso as any,
    course: message.course as any,
    date: message.date as any,
    delay: message.delay as any,
    desvio: message.desvio as any,
    driver: message.driver as any,
    estado: message.estado as any,
    hour: message.hour as any,
    internalNumber: message.internalNumber as any,
    lat: message.lat as any,
    line: message.line as any,
    lon: message.lon as any,
    puntoDePaso: message.puntoDePaso as any,
    schedule: message.schedule as any,
    service: message.service as any,
    speed: message.speed as any,
    statusService: message.statusService as any
    }

    console.log(await Core.intance.caching?.hGetAll(`socket:${message}`))
  });

},1000)

redisSubscribe.connectSocket();

