import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ciudadano, CiudadanoDocument } from '../schemas/ciudadano.schema';
import { ObtenerDatosPersonaDniResultDto } from '../dto/ObtenerDatosPersonaDniResultDto';
import { ObtenerDatosPersonaDniDto, RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as request from 'request-promise';
import { responseSunat } from '../dto/ObtenerDatosSUNAT';
import { CaptchaService } from "./captcha.service";

export class CiudadanoService {
  constructor(
    @InjectModel(Ciudadano.name)
    private ciudadanoDocument: Model<CiudadanoDocument>,
    private captchaService: CaptchaService,
  ) {}

  async obtenerPersonaPorDni(info: ObtenerDatosPersonaDniDto, ipAddress): Promise<ObtenerDatosPersonaDniResultDto> {
    await this.captchaService.validarCapcha(info.recaptcha, ipAddress);

    let result = null;
    try {
      const response = await request({
        uri: `${process.env.URL_RENIEC}`,
        method: 'POST',
        json: true,
        body: {
          codigo: process.env.CODIGO_RENIEC,
          clave: process.env.CLAVE_RENIEC,
          dni: info.dni,
        },
        resolveWithFullResponse: true,
      });

      if (response.statusCode == 200) {
        result = response.body;
        return {
          nombres: result.nombres,
          apellidoPaterno: result.appat,
          apellidoMaterno: result.apmat,
        };
      }
    } catch (err) {
      console.error('Error al obtener datos del ciudadano desde el servidor: ' + err);
      if (err.statusCode == 404) {
        throw new HttpException('El dni solicitado no existe', HttpStatus.NOT_FOUND);
      }
    }
    throw new HttpException('Error al obtener información', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async validarDatosPersona(req: RequestValidateData) {
    console.log('datos', req);
    let ciudadano = null;
    try {
      const response = await request({
        uri: `${process.env.URL_RENIEC}`,
        method: 'POST',
        json: true,
        body: {
          codigo: process.env.CODIGO_RENIEC,
          clave: process.env.CLAVE_RENIEC,
          dni: req.nroDocumento,
        },
        resolveWithFullResponse: true,
      });

      if (response.statusCode == 200) {
        const result = response.body;
        ciudadano = {
          fenac: result.fecnac,
          digverifica: result.digver,
        };
      }
    } catch (err) {
      console.error('Error al consultar el servicio de personas: ' + err);
    }

    console.log('validar ciudadano:', ciudadano);

    if (ciudadano) {
      const dateNacRequest = this.changueDate(new Date(req.fechaNacimiento)); //this.changueDate(request.fechaNacimiento);
      const fechaNac = this.changueDate(this.parseDate(ciudadano.fenac));

      if (req.codigoVerifi == ciudadano.digverifica && dateNacRequest === fechaNac) {
        return {
          status: true,
          mensaje: 'Datos correctos.',
        };
      } else {
        return {
          status: false,
          mensaje: 'Alguno de sus datos personales no coinciden, por favor verifique e intente nuevamente.',
        };
      }
    } else {
      return { status: false, mensaje: 'Persona no encontrada.' };
    }
  }

  parseDate(str) {
    const y = str.substr(0, 4),
      m = str.substr(4, 2) - 1,
      d = str.substr(6, 2);
    const D = new Date(y, m, d);
    if (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) {
      return D;
    }
    console.error('Error al parsear la fecha');
    return null;
  }

  nombresPadre(nombre: string): string[] {
    return ['JULIO', 'JUAN', 'DANIEL', nombre];
  }
  nombresMadre(nombre: string): string[] {
    return ['JULIA', 'JUANA', 'DANIELA', nombre];
  }

  changueDate(date : Date){

    let realDateObject = new Date(date);


    let day = realDateObject.getDate();
    let month = realDateObject.getMonth() + 1 ;
    let year = realDateObject.getFullYear();
    
    if(month < 10){
    return  `${day}-0${month}-${year}`
    }else{
    return `${day}-${month}-${year}`
    }


  }

  async validarDatosSUNAT(ruc){

    try {
      var asd : responseSunat = new responseSunat();
      console.log("RUUUUUUUUUUUC" , ruc.ruc)

      //var data = this.mySoapClient.DatosPrincipales({numdo :ruc});
      let response = await request({
        uri: `${process.env.URL_SUNAT}`,
        qs: {
            numruc: ruc.ruc,
            out: 'json'
        },
        headers: {
            'Accept': 'application/json'
        },
        resolveWithFullResponse: true
    });

    console.log("RESPUESTA", response)

    if (response.statusCode == 200) {
        asd = {
          razonSocial : JSON.parse(response.body),
          success : true
        }
        }else{
          asd = {
            razonSocial : "error servicio sunat",
            success : false
          }
        }

      return asd;

    } catch (error) {
      console.error(error)
      // return  {
      //   razonSocial : error,
      //   success : false
      // }
    }
  }

}
