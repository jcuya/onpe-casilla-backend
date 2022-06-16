export class ObtenerDatosPersonaDniDto {
  dni: string;
}

export class RequestValidateData{

  dni !: number;
  nombrePadre !: string;
  nombreMadre !: string;
  fechaNacimiento !:Date;
  codigoVerifi !: string;
}