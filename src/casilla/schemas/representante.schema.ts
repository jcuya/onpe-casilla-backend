import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Archivo } from './inbox.schema';

export type RepresentanteDocument = Representante & Document;

@Schema({ collection: 'representante' })
export class Representante {


  @Prop()
  tipoDocumentoAdjunto!: string;

  @Prop()
  tipoDocumentoAdjuntoNombre!: string;

  @Prop()
  tipoDocumento: string;

  @Prop()
  numeroDocumento: string;

  @Prop()
  nombreCompleto : string;

  @Prop()
  correoElectronico: string;

  @Prop()
  numeroCelular: string;

  @Prop()
  rucUser : string;

  @Prop()
  domicilioFisico: string;

  @Prop()
  cargo: string;

  @Prop()
  cargoNombre: string;

  @Prop()
  archivo: Archivo =  new Archivo()

  @Prop()
  created_at : string;

 
}

export const RepresentanteSchema = SchemaFactory.createForClass(Representante);