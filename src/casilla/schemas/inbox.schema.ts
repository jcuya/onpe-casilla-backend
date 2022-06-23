import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type InboxDocument = Inbox & Document;


export class Archivo {
  path : string;
  name : string;
}

@Schema({ collection: 'inbox' })
export class Inbox {
  @Prop()
  doc: string;

  @Prop()
  doc_type: string;

  @Prop()
  email: string;

  @Prop()
  cellphone: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  acreditation_type: string;

  @Prop()
  attachments: Archivo= new Archivo() ;

  @Prop()
  imageDNI : Archivo = new Archivo();

  @Prop()
  register_user_id: string;

  @Prop()
  created_at: Date;
  
  @Prop()
  create_user: string;

  @Prop()
  estado : string;
}

export const InboxSchema = SchemaFactory.createForClass(Inbox);