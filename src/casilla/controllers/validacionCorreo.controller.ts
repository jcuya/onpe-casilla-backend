import { Body, Controller, Post } from '@nestjs/common';
import { CodigoVerificacionService } from '../services/codigoVerificacion.service';
import { EnviarCorreoVerificacionDto } from '../dto/EnviarCorreoVerificacionDto';
import { ValidarCodigoDto } from '../dto/ValidarCodigoDto';

@Controller()
export class ValidacionCorreoController {
  constructor(
    private readonly codigoVerificacionService: CodigoVerificacionService,
  ) {}

  @Post('enviar-correo-verificacion')
  async enviarCorreoVerificacion(@Body() dto: EnviarCorreoVerificacionDto) {
    /*if (!validarEnviarCorreoParams(req.body, res)) {
      return enviarResultadoIncorrecto(
        res,
        'Los datos para el envío del correo de verificación no son válidos',
      );
    }*/

    return await this.codigoVerificacionService.enviarCodigoVerificacion(
      dto.tipoDocumento,
      dto.numeroDocumento,
      dto.correoElectronico,
    );
  }

  @Post('validar-codigo-verificacion')
  async validarCodigo(@Body() dto: ValidarCodigoDto) {
    /*if (!validarValidarCodigoParams(req.body)) {
      return enviarResultadoIncorrecto(
        res,
        'Los datos para la validación del código no son válidos',
      );
    }*/
    const valido =
      await this.codigoVerificacionService.validarCodigoVerificacion(
        dto.tipoDocumento,
        dto.numeroDocumento,
        dto.idEnvio,
        dto.codigo,
      );
    return {
      esValido: valido,
    };
  }
}
