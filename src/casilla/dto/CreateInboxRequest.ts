import {IsEmail, IsNotEmpty, IsOptional, Length, Matches, MaxLength, MinLength} from "class-validator";

export class CreateInboxRequest {

  @Length(2, 3)
  @IsNotEmpty()
  @Matches('^(dni|DNI|ce|CE)$')
  tipoDocumento: string;

  @Length(8, 9)
  @IsNotEmpty()
  @Matches('^[0-9]*$')
  numeroDocumento: string;

  @Length(9, 200)
  @IsNotEmpty()
  @IsOptional()
  @Matches('^[^{}<>%$]*$')
  razonSocial: string;

  @Length(5, 50)
  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;

  @Length(9, 9)
  @IsNotEmpty()
  @Matches('^[0-9]*$')
  numeroCelular: string;

  @IsOptional()
  // @Matches('^[0-9]*$')
  telefono: string;

  @MaxLength(500)
  @IsOptional()
  paginaweb: string;

  @IsNotEmpty()
  // @Length(9, 200)
  domicilioFisico: string;

  @Length(1, 50)
  @IsNotEmpty()
  @Matches('^[^{}<>%$]*$')
  nombres: string;

  @MaxLength(50)
  @IsOptional()
  @Matches('^[^{}<>%$]*$')
  apePaterno: string;

  @MaxLength(50)
  @IsOptional()
  @Matches('^[^{}<>%$]*$')
  apeMaterno: string;

  @IsNotEmpty()
  @Matches('^(n|j)$')
  tipoPersona: string;

  @IsNotEmpty()
  ubigeo: string;

  @IsNotEmpty()
  recaptcha: string;
}
