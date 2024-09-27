import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class OTP extends Document {
  @Prop({ type: String, default: () => uuidv4(), unique: true })
  uuid: string;

  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: String, required: true })
  user_uuid: string;

  @Prop({ type: Boolean, default: false })
  isUsed: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
