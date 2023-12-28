import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { EValidRoles } from '../../auth/enums/valid-roles.enum';

@Schema()
export class User extends Document {
  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ select: false, required: true })
  password: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ enum: EValidRoles, default: EValidRoles.USER_ROLE })
  role: EValidRoles;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
