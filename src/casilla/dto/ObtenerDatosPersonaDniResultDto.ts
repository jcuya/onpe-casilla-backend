export class ObtenerDatosPersonaDniResultDto {
  nombres: string;
  apellidos: string;
  nombrePadre: string[];
  nombreMadre: string[];
}

export class ResponseValidateData{
  status !: boolean;
  mensaje !: string;
}