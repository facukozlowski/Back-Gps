enum StatusService {
    ATRASADO="ATRASADO",
    ADELANTADO="ADELANTADO",
    EN_HORARIO="EN HORARIO",
    SIN_CONFIGURACION="SIN CONFIGURACION",
    REVISAR_BANDERA="REVISAR BANDERA"
  }

interface webSocketResponse {
    HoraPuntoDePaso:string; // hh:mm:ss.mmm
    course: number;
    date: string; // ddmmaa
    delay: string; // +/-mm:ss
    desvio: string; // +/-mm:ss
    driver: string;
    estado: StatusService,
    hour: string; // hh:mm:ss
    idSocket: number;
    internalNumber: number;
    lat: number;
    line: string;
    lon: number;
    puntoDePaso: string;
    schedule: number;
    service: number;
    speed: number;
    statusService: StatusService
  }



export interface Response {
    idSocket: number;
    recId: string;
    Date: string;
    dateTime?: string;
    msg: string;
    statusService: StatusService;
    desvio?: string;
    HoraPuntoDePaso?: string;
    puntoDePaso?: string;
    inicioViaje?: any;
    findViaje?: any;
    driver?: string;
    docketDriver?: number;
  }

 
