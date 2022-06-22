import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type userInboxDocument = UserInbox & Document;

@Schema({ collection: 'user_inbox' })
export class UserInbox {
  @Prop()
  doc: string;

  @Prop()
  doc_type: string;

  @Prop()
  profile: string;

  @Prop()
  inbox_id : string;

  
}

export const UserInboxSchema = SchemaFactory.createForClass(UserInbox);