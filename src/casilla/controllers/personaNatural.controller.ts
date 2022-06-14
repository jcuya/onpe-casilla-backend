import { Body, Controller, Post } from '@nestjs/common';
import { ObtenerDatosPersonaDniDto } from '../dto/ObtenerDatosPersonaDniDto';
import { CiudadaoService } from '../services/ciudadao.service';
import { ObtenerDatosPersonaDniResultDto } from '../dto/ObtenerDatosPersonaDniResultDto';

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
}
