import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ObtenerDatosPersonaDniDto, RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { CiudadanoService } from '../services/ciudadano.service';
import { ObtenerDatosPersonaDniResultDto, ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';
import { UserService } from "../services/user.service";
import { InboxService } from '../services/inbox.service';

@Controller()
export class PersonaNaturalController {
  constructor(
    private readonly userService: UserService,
    private readonly ciudadanoService: CiudadanoService,
    private readonly inboxService: InboxService,
  ) {}

  @Post('obtener-datos-persona-dni')
  async obtenerDatosPersonaDni(
    @Body() obtenerDatosPersonaDniDto: ObtenerDatosPersonaDniDto,
    @Ip() ipAddress
  ): Promise<ObtenerDatosPersonaDniResultDto> {
    return await this.ciudadanoService.obtenerPersonaPorDni(
      obtenerDatosPersonaDniDto,ipAddress
    );
  }

  @Post('validarPersona')
  async validarPersona(
    @Body() request: RequestValidateData ): Promise<ResponseValidateData> {

    let resultado;
    request.tipoDocumento = request.tipoDocumento.toLowerCase();
    if (request.tipoDocumento == 'dni') {
      resultado = await this.ciudadanoService.validarDatosPersona(request);
    } else {
      resultado = { status: true, mensaje: 'Datos correctos.' };
    }
    if (resultado.status) {
      let existUserWithDoc = await this.inboxService.existeCasilleroConDoc(request.tipoDocumento, request.nroDocumento);
      let existUserWithEmail = await this.inboxService.existeCasilleroConCorreo(request.correo);
      if (existUserWithDoc || existUserWithEmail) {
        resultado.status = false;
        resultado.mensaje = 'Usted ya cuenta con Casilla electrónica ingrese aquí https://casillaelectronica.onpe.gob.pe/#/login y haga clic en "Olvidé mi contraseña"';
      }
    }
    return resultado;
  }
}
