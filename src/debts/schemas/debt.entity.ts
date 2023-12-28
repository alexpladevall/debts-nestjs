import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Debt extends Document {
  @Prop({ type: Types.ObjectId, ref: 'UserModel', required: true })
  fromUserId: string;

  @Prop({ type: Types.ObjectId, ref: 'UserModel', required: true })
  toUserId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DebtSchema = SchemaFactory.createForClass(Debt);
