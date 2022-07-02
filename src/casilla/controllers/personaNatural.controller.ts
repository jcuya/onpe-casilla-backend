import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ObtenerDatosPersonaDniDto, RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { CiudadanoService } from '../services/ciudadano.service';
import { ObtenerDatosPersonaDniResultDto, ResponseValidateData } from '../dto/ObtenerDatosPersonaDniResultDto';
import { UserService } from "../services/user.service";

@Controller()
export class PersonaNaturalController {
  constructor(
    private readonly userService: UserService,
    private readonly ciudadanoService: CiudadanoService,
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
    if (request.tipoDocumento == 'DNI') {
      resultado = await this.ciudadanoService.validarDatosPersona(request);
    } else {
      resultado = {status: true, mensaje: 'Datos correctos.'};
    }
    if (resultado.status) {
      let existUserWithDoc = await this.userService.existeUsuarioConDoc(request.tipoDocumento, request.nroDocumento, 'citizen');
      let existUserWithEmail = await this.userService.existeUsuarioConCorreo(request.correo, 'citizen');
      if (existUserWithDoc || existUserWithEmail) {
        resultado.status = false;
        resultado.mensaje = 'Ya existe un usuario registra con el nro documento registrado y/ correo electrónico';
      }
    }
    return resultado;
  }
}
