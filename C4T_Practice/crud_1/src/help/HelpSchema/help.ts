import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class help extends Document {
  @Prop({ default: null })
  name: string;
  @Prop({ unique: true })
  gmail: string;
}

export const helpSchema = SchemaFactory.createForClass(help);
