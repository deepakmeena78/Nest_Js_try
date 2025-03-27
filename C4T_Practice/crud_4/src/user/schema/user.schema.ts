import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, model, Mongoose } from 'mongoose';

@Schema({ timestamps: true })
export class user extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ default: null })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(user);
