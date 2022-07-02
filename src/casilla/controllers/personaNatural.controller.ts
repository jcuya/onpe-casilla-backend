import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ObtenerDatosPersonaDniDto, RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { CiudadaoService } from '../services/ciudadao.service';
import { ObtenerDatosPersonaDniResultDto, ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';

@Controller()
export class PersonaNaturalController {
  constructor(private readonly ciudadaoService: CiudadaoService) {}

  @Post('obtener-datos-persona-dni')
  async obtenerDatosPersonaDni(
    @Body() obtenerDatosPersonaDniDto: ObtenerDatosPersonaDniDto,
    @Ip() ipAddress
  ): Promise<ObtenerDatosPersonaDniResultDto> {
    return await this.ciudadaoService.obtenerPersonaPorDni(
      obtenerDatosPersonaDniDto,ipAddress
    );
  }

  @Post('validarPersona')
  async validarPersona(
    @Body() request: RequestValidateData ): Promise<ResponseValidateData> {
    return await this.ciudadaoService.validarDatosPersona( request);
  }
}
