import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ciudadano, CiudadanoDocument } from '../schemas/ciudadano.schema';
import { ObtenerDatosPersonaDniResultDto } from '../dto/ObtenerDatosPersonaDniResultDto';
import { RequestValidateData } from '../dto/ObtenerDatosPersonaDniDto';
import { Inject } from '@nestjs/common';
import { Client } from 'nestjs-soap';

export class CiudadaoService {
  constructor(
    @InjectModel(Ciudadano.name)
    private ciudadanoDocument: Model<CiudadanoDocument>,
    @Inject('MY_SOAP_CLIENT') private readonly mySoapClient: Client
  ) {}

  async obtenerPersonaPorDni(
    dni: string,
  ): Promise<ObtenerDatosPersonaDniResultDto> {
    console.log('dni is', dni);
    const ciudadano = await this.ciudadanoDocument.findOne(
      {
        tidocumento: 'DNI',
        nudocumento: dni,
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


  async validarDatosPersona( request : RequestValidateData){
    console.log("datos", request);
    const ciudadano = await this.ciudadanoDocument.findOne(
      {
        tidocumento: 'DNI',
        nudocumento: request.dni,
      },
      {
        _id: 0,
        nopadre: 1,
        nomadre: 1,
        fenac :1,
        digverifica : 1
      },
    );

    if (ciudadano) {
      var dateNacRequest = this.changueDate(new Date(request.fechaNacimiento)) //this.changueDate(request.fechaNacimiento);
      var dateNacMongo =  new Date (ciudadano.fenac);
       dateNacMongo.setDate(dateNacMongo.getDate()+ 1);
       var result = this.changueDate(dateNacMongo);

      if(request.nombrePadre === ciudadano.nopadre && request.nombreMadre === ciudadano.nomadre && request.codigoVerifi == ciudadano.digverifica && dateNacRequest === result){

        return {
          status : true,
          mensaje : "Datos correctos."
        }

      }else{
        return {
          status : false,
          mensaje : "Alguno de los siguientes datos no coincide. (Nombre padre - Nombre madres - Fecha nacimiento - Dígito verificación"
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

      var data = this.mySoapClient.DatosPrincipales({numdo :ruc});

      asd = {
        razonSocial : data,
        success : true
      }


      return asd;

      
    } catch (error) {
      
    }
  }

}
