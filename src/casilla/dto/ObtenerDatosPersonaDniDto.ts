import { IsEmail, IsNotEmpty } from "class-validator";

export class ObtenerDatosPersonaDniDto {
  dni: string;
  recaptcha: string;
}

export class RequestValidateData {
  @IsNotEmpty()
  tipoDocumento: string;

  @IsNotEmpty()
  nroDocumento: string;

  @IsNotEmpty()
  fechaNacimiento: Date;

  @IsNotEmpty()
  codigoVerifi: string;

  @IsEmail()
  correo: string;
}
