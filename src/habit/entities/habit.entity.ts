import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Habit extends Document {
  @Prop()
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [Date], default: [] })
  completedDates: Date[];

  @Prop({ default: 0 })
  streak: number;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: 0 })
  priority: number;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
HabitSchema.plugin(mongoosePaginate);
