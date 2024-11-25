import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SortBy } from './entities/habit.entity.enum';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiOperation({ summary: 'Create Habit' })
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitService.create(createHabitDto);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get Single Habit' })
  findOne(@Param('id') id: string) {
    return this.habitService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get Multiple Habits With Searching And Sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter habits by title',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortBy,
    description: 'Sort by createdAt or streak',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Order by ascending or descending',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title?: string,
    @Query('sortBy') sortBy: SortBy = SortBy.CREATED_AT,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
  ) {
    return this.habitService.findAll(page, limit, title, sortBy, orderBy);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Existing Habit' })
  @ApiParam({ name: 'id', description: 'The ID of the habit to update' })
  async updateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitService.updateHabit(id, updateHabitDto);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Mark habit as archive' })
  archiveHabit(@Param('id') id: string) {
    return this.habitService.archiveHabit(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark habit as completed for today' })
  @ApiParam({ name: 'id', description: 'ID of the habit' })
  markAsCompleted(@Param('id') id: string) {
    return this.habitService.markAsCompleted(id);
  }
}
