export class ObtenerDatosPersonaDniDto {
  dni: string;
  recaptcha : string;
}

export class RequestValidateData {
  tipoDocumento!: string;
  nroDocumento!: string;
  nombrePadre: string;
  nombreMadre: string;
  fechaNacimiento !:Date;
  codigoVerifi: string;
  correo!: string;
}
