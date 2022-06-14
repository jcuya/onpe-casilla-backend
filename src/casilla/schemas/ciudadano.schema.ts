import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CiudadanoDocument = Ciudadano & Document;

@Schema({ collection: 'ciudadanos' })
export class Ciudadano {
  @Prop()
  tidocumento: string;

  @Prop()
  nudocumento: string;

  @Prop()
  nombre: string;

  @Prop()
  paterno: string;

  @Prop()
  materno: string;

  @Prop()
  fenac: Date;

  @Prop()
  feemision: Date;

  @Prop()
  digverifica: string;

  @Prop()
  email: string;

  @Prop()
  nucelular: string;

  @Prop()
  grupovota: string;

  @Prop()
  direccion: string;

  @Prop()
  nopadre: string;

  @Prop()
  nomadre: string;

  @Prop()
  esreg: string;
}

export const CiudadanoSchema = SchemaFactory.createForClass(Ciudadano);
