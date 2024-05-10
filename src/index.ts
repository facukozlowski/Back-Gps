import dotenv from 'dotenv';
import { Core } from '../src/server/server';
import { SubscriptionListeners } from './database/redisSubscribe';
import{ server, wss } from './app'; 
import { mongoConnect } from '../src/database/mongoConnection';
import { ICalculousResponse, webSocketResponse } from './schemas/data.model';

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

setTimeout(() => {
  redisSubscribe.newChannel("calculous:response", async (message, channel) => {
    const calculousResponse:ICalculousResponse = message as any

      let objetoVariable: webSocketResponse = {
          idSocket: calculousResponse.idSocket,
          HoraPuntoDePaso:calculousResponse.HoraPuntoDePaso!, 
          course: 0,
          date: calculousResponse.Date,
          hour: "",
          delay: calculousResponse.desvio!,
          desvio: calculousResponse.desvio!,
          driver: "",
          estado:calculousResponse.statusService,
          statusService: calculousResponse.statusService,
          internalNumber: 0,
          lat: 0,
          lon: 0,
          speed: 0,
          schedule: 0,
          service: 0,
          line: "", 
          puntoDePaso: calculousResponse.HoraPuntoDePaso!,
      };

      const [course,hour,driver,internalNumber,lat,lon,speed,schedule,line,service] = await Core.intance.caching?.hmGet(`socket:${calculousResponse.idSocket}`,["course","hour","driver","internalNumber","lat","lon","speed","schedule","line","service"]) || []

      objetoVariable.course = Number(course)
      objetoVariable.hour = hour
      objetoVariable.driver = driver
      objetoVariable.internalNumber = Number(internalNumber)
      objetoVariable.lat = Number(lat)
      objetoVariable.lon = Number(lon)
      objetoVariable.speed = Number(speed)
      objetoVariable.schedule = Number(schedule)
      objetoVariable.line = line
      objetoVariable.service = Number(service)

      console.log(await Core.intance.caching?.hGetAll(`socket:${message.idSocket}`));

      console.log(objetoVariable);
  });
}, 1000);

redisSubscribe.connectSocket();

