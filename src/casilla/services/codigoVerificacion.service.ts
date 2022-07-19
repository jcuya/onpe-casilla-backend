import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import {
  CodigoVerificacion,
  CodigoVerificacionDocument,
} from '../schemas/codigoVerificacion.schema';
import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { EmailService } from './email.service';


export class CodigoVerificacionService {
  constructor(
    @InjectModel(CodigoVerificacion.name)
    private codigoVerificacionModel: Model<CodigoVerificacionDocument>,
    private emailService: EmailService,
  ) {}

  async enviarCodigoVerificacion(
    tipoDocumento,
    numeroDocumento,
    correo,
  ) {
    const codigo = randomBytes(3).toString('hex').toUpperCase();

    const minutosValidez = 5;
    const ahora = new Date();
    const validez = new Date(ahora.getTime() + 1000 * 60 * minutosValidez);

    const result = await this.codigoVerificacionModel.insertMany({
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento,
      correoElectronico: correo,
      codigo: codigo,
      fechaCreacion: ahora,
      validoHasta: validez,
      intentosValidacion: 0,
      activo: true,
    });
    let id;
    if (result.length == 1) {
      id = result[0]._id;
    } else {
      id = null;
    }
    this.emailService.enviarCorreo( process.env.EMAIL_ORIGEN, correo, 'Nueva Notificación - SISEN', this.crearPlantillaCorreo(codigo));
    return {
      idEnvio: id,
    };
  }


  crearPlantillaCorreo(codigo: string) {
    const content = readFileSync('./template/enviar-codigo-verificacion.html');
    return eval(`\`${content.toString()}\``);
  }

  async validarCodigoVerificacion(
    tipoDocumento: string,
    numeroDocumento: string,
    idEnvio: string,
    codigo: string,
  ) {
    const result = await this.codigoVerificacionModel.findOne({
      _id: idEnvio,
    });
    if (!result) {
      console.log(
        'No se encontró un registro con el id para los datos para validar el código',
        idEnvio,
      );
      return false;
    }
    console.log(result.validoHasta, new Date());
    if (result.validoHasta < new Date()) {
      console.log('Se paso la fecha válida del código');
      return false;
    }
    if (result.intentosValidacion >= 3) {
      console.log(
        'Se alcanzó el número máximo de intentos de validación del código',
      );
      return false;
    }
    if (
      result.tipoDocumento !== tipoDocumento &&
      result.numeroDocumento !== numeroDocumento
    ) {
      this.incrementarIntentos(idEnvio, result.intentosValidacion);
      console.log(
        'El tipo y número de documento no coinciden con el registro a validar',
        idEnvio,
        tipoDocumento,
        numeroDocumento,
      );
      return false;
    }
    if (!result.activo) {
      console.log('El código ya no está activo');
      return false;
    }
    if (result.codigo !== codigo) {
      this.incrementarIntentos(idEnvio, result.intentosValidacion);
      console.log('El codigo del usuario no coincide con el registrado');
      return false;
    }
    this.desactivarCodigo(idEnvio);
    return true;
  }

  incrementarIntentos(idEnvio: string, intentosActuales: number) {
    this.codigoVerificacionModel.updateOne(
      {
        _id: idEnvio,
      },
      {
        $set: {
          intentosValidacion: intentosActuales + 1,
        },
      },
    );
  }

  desactivarCodigo(idEnvio: string) {
    this.codigoVerificacionModel.updateOne(
      {
        _id: idEnvio,
      },
      {
        $set: {
          activo: false,
        },
      },
    );
  }
}
