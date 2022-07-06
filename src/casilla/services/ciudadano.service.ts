import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ciudadano, CiudadanoDocument } from '../schemas/ciudadano.schema';
import { ObtenerDatosPersonaDniResultDto } from '../dto/ObtenerDatosPersonaDniResultDto';
import { ObtenerDatosPersonaDniDto, RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { Inject } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import * as request from 'request-promise';
import { responseSunat } from '../dto/ObtenerDatosSUNAT';

export class CiudadanoService {
  constructor(
    @InjectModel(Ciudadano.name)
    private ciudadanoDocument: Model<CiudadanoDocument>,
    //@Inject('MY_SOAP_CLIENT') private readonly mySoapClient: Client
  ) {}

  async obtenerPersonaPorDni(info: ObtenerDatosPersonaDniDto,ipAddress ): Promise<ObtenerDatosPersonaDniResultDto> {
   
    let resultado = await this.isValid(info.recaptcha, ipAddress);
    /*if (!resultado) {
      return null;
  }*/

    const ciudadano = await this.ciudadanoDocument.findOne(
      {
        dni: info.dni,
      },
      {
        _id: 0,
        nombre: 1,
        paterno: 1,
        materno: 1,
        nopadre: 1,
        nomadre: 1,
      },
    );
    if (!ciudadano) {
      return null;
    }
    console.log(ciudadano);
    return {
      nombres: ciudadano.nombre,
      apellidos: ciudadano.paterno + ' ' + ciudadano.materno,
      nombrePadre: this.nombresPadre(ciudadano.nopadre),
      nombreMadre: this.nombresMadre(ciudadano.nomadre),
    };
  }



  async isValid (code, ip) {
    try {
        let gResponse = await request({
            url: 'https://www.google.com/recaptcha/api/siteverify',
            method: 'POST',
            json: true,
            form: {
                secret: process.env.RECAPTCHA_SECRET,
                response: code,
                remoteip: ip
            }
        });

        if (gResponse) {
            return gResponse.success;
        }
    } catch (err) {
        console.error(err);
    }

    return false;
}






  async validarDatosPersona( request : RequestValidateData){
    console.log("datos", request);
    const ciudadano = await this.ciudadanoDocument.findOne(
      {
        dni: request.nroDocumento,
      },
      {
        _id: 0,
        nopadre: 1,
        nomadre: 1,
        fenac :1,
        digverifica : 1
      },
    );
    console.log("validar ciudadano:", ciudadano);

    if (ciudadano) {
      var dateNacRequest = this.changueDate(new Date(request.fechaNacimiento)) //this.changueDate(request.fechaNacimiento);
      var dateNacMongo =  new Date (ciudadano.fenac);
       dateNacMongo.setDate(dateNacMongo.getDate()+ 1);
       var result = this.changueDate(dateNacMongo);
       console.log ("Comparación fechaNacimiento --->> dato front: ",dateNacRequest, " -- ||  Dato BD:", result, "\n");
       console.log ("Comparación NombrePadre --->> dato front: ",request.nombrePadre, " -- ||  Dato BD:", ciudadano.nopadre, "\n");
       console.log ("Comparación NombreMadre --->> dato front: ", request.nombreMadre, " -- ||  Dato BD:", ciudadano.nomadre, "\n");
       console.log ("Comparación DigitoVerificacion --->> dato front: ",request.codigoVerifi, " -- ||  Dato BD:", ciudadano.digverifica , "\n");

       if(request.codigoVerifi == ciudadano.digverifica && dateNacRequest === result){
       //if(request.nombrePadre === ciudadano.nopadre && request.nombreMadre === ciudadano.nomadre && request.codigoVerifi == ciudadano.digverifica && dateNacRequest === result){

        return {
          status : true,
          mensaje : "Datos correctos."
        }

      }else{
        return {
          status : false,
          mensaje : "Alguno de sus datos personales no coincide, por favor verifique e intenta nuevamente."
        }
      }

    
    }else{
      return {status : false , mensaje : "Persona no encontrada."}
    }
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
