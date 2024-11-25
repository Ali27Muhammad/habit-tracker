import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Habit extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [Date], default: [] })
  completedDates: Date[]; // Dates when the habit was marked as completed

  @Prop({ default: 0 })
  streak: number; // Current streak of consecutive days

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: 0 })
  priority: number; // Priority for sorting
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
HabitSchema.plugin(mongoosePaginate);
