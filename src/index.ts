import dotenv from 'dotenv';
import { SubscriptionListeners } from './database/redisSubscribe';
import { server, wss, sendMessageCity } from './app'; 
import { ICalculousResponse, webSocketResponse } from './schemas/data.model';
import { mongoConnect } from './database/mongoConnection';
import { Core } from './server/server';
import { DateTime } from 'luxon';
import { StatusService } from './schemas/data.model';

dotenv.config();

const PORT = process.env.PORT;

mongoConnect(process.env.DATABASE!);

wss.on('listening', () => {
});

server.listen(PORT, () => {
});

const redisSubscribe = new SubscriptionListeners(process.env.REDIS!);
Core.intance

setTimeout(() => {
  redisSubscribe.newChannel("calculous:response", async (message, channel) => {
    const calculousResponse: ICalculousResponse = message as any;

    let response: webSocketResponse = {
      idSocket: Number(calculousResponse.idSocket),
      HoraPuntoDePaso: calculousResponse.HoraPuntoDePaso!,
      course: 0,
      date: DateTime.fromISO(calculousResponse.Date).toFormat("yyMMdd"),
      hour: DateTime.fromISO(calculousResponse.Date).toFormat("hh:mm:ss"),
      delay: calculousResponse.desvio!,
      desvio: calculousResponse.desvio!,
      driver: "",
      estado: calculousResponse.statusService?.replace(/"/g, "") as StatusService,
      statusService: calculousResponse.statusService?.replace(/"/g, "") as StatusService,
      internalNumber: 0,
      lat: 0,
      lon: 0,
      speed: 0,
      schedule: 0,
      service: 0,
      line: "",
      puntoDePaso: calculousResponse.puntoDePaso!,
    };

    const [HoraPuntoDePaso, course, delay, driver, statusService, internalNumber, lat, lon, speed, schedule, line, service, puntoDePaso] = await Core.intance.caching?.hmGet(`socket:${calculousResponse.idSocket}`, ["HoraPuntoDePaso", "course", "delay", "driver", "statusService", "internalNumber", "lat", "lon", "speed", "schedule", "line", "service", "puntoDePaso"]) || [];

    response.HoraPuntoDePaso = HoraPuntoDePaso;
    response.course = Number(course);
    response.delay = delay
    response.desvio = delay
    response.driver = driver;
    response.estado = statusService ? (statusService.replace(/"/g, "") as StatusService) : StatusService.SIN_CONFIGURACION;
    response.statusService = statusService ? (statusService.replace(/"/g, "") as StatusService) : StatusService.SIN_CONFIGURACION;
    response.internalNumber = Number(internalNumber);
    response.lat = Number(lat);
    response.lon = Number(lon);
    response.speed = Number(speed);
    response.schedule = Number(schedule);
    response.line = line;
    response.service = Number(service);
    response.puntoDePaso = puntoDePaso;

    console.log(response, response.idSocket);

    if (response.idSocket >= 8_700_000 && response.idSocket <= 8_700_999) {
      sendMessageCity(JSON.stringify(response), "Posadas");
    } else if (response.idSocket >= 8_701_000 && response.idSocket <= 8_701_999) {
      sendMessageCity(JSON.stringify(response), "Obera");
    }
  });

  redisSubscribe.connectSocket();
}, 1000);
