import { Body, Controller, Post } from '@nestjs/common';
import { CodigoVerificacionService } from '../services/codigoVerificacion.service';
import { EnviarCorreoVerificacionDto } from '../dto/EnviarCorreoVerificacionDto';
import { ValidarCodigoDto } from '../dto/ValidarCodigoDto';
import { InboxService } from '../services/inbox.service';

@Controller()
export class ValidacionCorreoController {
  constructor(
    private readonly codigoVerificacionService: CodigoVerificacionService,
    private readonly inboxService: InboxService,
  ) {}

  @Post('enviar-correo-verificacion')
  async enviarCorreoVerificacion(@Body() dto: EnviarCorreoVerificacionDto) {
    return await this.codigoVerificacionService.enviarCodigoVerificacion(
      dto.tipoDocumento,
      dto.numeroDocumento,
      dto.correoElectronico,
    );
  }

  @Post('validar-codigo-verificacion')
  async validarCodigo(@Body() dto: ValidarCodigoDto) {
    const valido = await this.codigoVerificacionService.validarCodigoVerificacion(
      dto.tipoDocumento,
      dto.numeroDocumento,
      dto.idEnvio,
      dto.codigo,
    );
    if (!valido) {
      console.log('El código de verificación es Incorrecto');
      return {
        esValido: false,
        mensaje: 'El código de verificación es Incorrecto',
      };
    }
    const existUserWithEmail = await this.inboxService.existeCasilleroConCorreo(dto.correo);
    if (existUserWithEmail) {
      console.log('El correo electrónico ya se encuentra en uso');
      return {
        esValido: false,
        mensaje: 'El correo electrónico ya se encuentra en uso',
      };
    }
    return {
      esValido: true,
      mensaje: 'El codigo fue validado exitosamente',
    };
  }
}
