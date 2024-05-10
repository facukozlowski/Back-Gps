import express, { urlencoded } from 'express';
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import jwt from 'jsonwebtoken';
import cors from "cors"

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(morgan('dev'));
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cors({
  origin: "*",
  credentials: false
}))
app.use("/api/v1", authRoutes);

const conexionesPorCiudad: { [ciudad: string]: WebSocket[] } = {};

wss.on('connection', (cliente) => {  
  cliente.on('message',manejadorDeMensajes(cliente));
});


function manejadorDeMensajes ( cliente:WebSocket){
  return (message:Buffer)=>{

    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'Subscription' && data.token) {
        const token = data.token.split(' ')[1];
        
        const ciudad = cityOfToken(token);
        
        if (!ciudad) {
          console.error('Token inválido:', token);
          return;
        }        
        
        if (!conexionesPorCiudad[ciudad]) {
          conexionesPorCiudad[ciudad] = [];
        }
        conexionesPorCiudad[ciudad].push(cliente);
      } else {
        console.error('Mensaje no válido:', data);
      }
    } catch (error) {
      console.error('Error al parsear el mensaje JSON:', error);
    }
    
    cliente.send(`Servidor: Recibí tu mensaje "${message}"`);
  }
  }

function sendMessageCity(mensaje: string, ciudad: string) {
  const conexiones = conexionesPorCiudad[ciudad];
  if (conexiones) {
    conexiones.forEach(cliente => {
      cliente.send(mensaje);
    });
  }
}

function cityOfToken(token: string): string | undefined {
  try {
    const decodedToken: any = jwt.decode(token);

    if (decodedToken && decodedToken.city) {
      return decodedToken.city;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return undefined;
  }
}

export { server, wss, sendMessageCity };
export default app;