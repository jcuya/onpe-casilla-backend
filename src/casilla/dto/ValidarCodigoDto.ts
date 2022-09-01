import {IsNotEmpty} from "class-validator";

export class ValidarCodigoDto {
  @IsNotEmpty()
  tipoDocumento: string;

  @IsNotEmpty()
  numeroDocumento: string;

  @IsNotEmpty()
  idEnvio: string;

  @IsNotEmpty()
  codigo: string;

  @IsNotEmpty()
  correo: string;
}
