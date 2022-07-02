export class ObtenerDatosPersonaDniDto {
  dni: string;
  recaptcha : string;
}

export class RequestValidateData{

  dni !: number;
  nombrePadre !: string;
  nombreMadre !: string;
  fechaNacimiento !:Date;
  codigoVerifi !: string;
}