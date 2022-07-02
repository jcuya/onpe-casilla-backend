import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CiudadanoDocument = Ciudadano & Document;

@Schema({ collection: 'persona' })
export class Ciudadano {

  @Prop()
  dni: string;

  @Prop()
  nombre: string;

  @Prop()
  paterno: string;

  @Prop()
  materno: string;

  @Prop()
  fenac: Date;

  @Prop()
  digverifica: string;

  @Prop()
  nopadre: string;

  @Prop()
  nomadre: string;
}

export const CiudadanoSchema = SchemaFactory.createForClass(Ciudadano);
