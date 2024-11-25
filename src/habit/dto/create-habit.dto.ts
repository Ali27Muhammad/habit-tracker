import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({ description: 'Title of the habit', example: 'Morning Run' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the habit',
    example: 'Run 5km every morning',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Dates when the habit was marked as completed',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  completedDates?: Date[];

  @ApiProperty({
    description: 'Current streak of consecutive days',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  streak?: number;

  @ApiProperty({
    description: 'Whether the habit is archived',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiProperty({
    description: 'Priority of the habit',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  priority?: number;
}
