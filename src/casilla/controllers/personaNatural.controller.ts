import { Body, Controller, Post } from '@nestjs/common';
import { ObtenerDatosPersonaDniDto, RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { CiudadaoService } from '../services/ciudadao.service';
import { ObtenerDatosPersonaDniResultDto, ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';

@Controller()
export class PersonaNaturalController {
  constructor(private readonly ciudadaoService: CiudadaoService) {}

  @Post('obtener-datos-persona-dni')
  async obtenerDatosPersonaDni(
    @Body() obtenerDatosPersonaDniDto: ObtenerDatosPersonaDniDto,
  ): Promise<ObtenerDatosPersonaDniResultDto> {
    return await this.ciudadaoService.obtenerPersonaPorDni(
      obtenerDatosPersonaDniDto.dni,
    );
  }

  @Post('validarPersona')
  async validarPersona(
    @Body() request: RequestValidateData ): Promise<ResponseValidateData> {
    return await this.ciudadaoService.validarDatosPersona( request);
  }
}
