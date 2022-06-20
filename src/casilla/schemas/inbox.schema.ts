import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InboxDocument = Inbox & Document;

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
  attachments: string;

  @Prop()
  register_user_id: string;

  @Prop()
  created_at: Date;
  
  @Prop()
  create_user: string;
}

export const InboxSchema = SchemaFactory.createForClass(Inbox);