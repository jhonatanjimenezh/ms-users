import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class User extends Document {
  @Prop({ type: String, default: () => uuidv4(), unique: true })
  uuid: string;

  @Prop({ type: String, required: true, unique: true })
  document: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
