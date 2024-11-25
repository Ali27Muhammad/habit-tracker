import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';
import { PaginateModel } from 'mongoose';
import { SortBy } from './entities/habit.entity.enum';

@Injectable()
export class HabitService {
  constructor(
    @InjectModel(Habit.name) private readonly habitModel: PaginateModel<Habit>,
  ) {}

  async create(createHabitDto: CreateHabitDto): Promise<Habit> {
    const newHabit = new this.habitModel(createHabitDto);
    return await newHabit.save();
  }

  async findOne(id: string): Promise<Habit> {
    const habit = await this.habitModel.findById(id).exec();
    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }
    return habit;
  }

  async findAll(
    page: number,
    limit: number,
    title?: string,
    sortBy: SortBy = SortBy.CREATED_AT,
    orderBy: 'asc' | 'desc' = 'desc',
  ): Promise<any> {
    const query: any = { isArchived: false };

    if (title) {
      query.title = { $regex: `^${title}`, $options: 'i' };
    }

    const options: any = {
      page,
      limit,
      sort: { [sortBy]: orderBy === 'asc' ? 1 : -1 },
    };

    return this.habitModel.paginate(query, options);
  }

  async updateHabit(
    id: string,
    updateHabitDto: UpdateHabitDto,
  ): Promise<Habit> {
    const updatedHabit = await this.habitModel
      .findByIdAndUpdate(id, updateHabitDto, { new: true })
      .exec();

    if (!updatedHabit) {
      throw new NotFoundException(`Habit with ID "${id}" not found`);
    }

    return updatedHabit;
  }

  async archiveHabit(id: string): Promise<Habit> {
    const habit = await this.habitModel.findById(id);

    if (!habit) {
      throw new NotFoundException(`Habit with ID "${id}" not found`);
    }

    habit.isArchived = true;
    return habit.save();
  }

  async getArchivedHabits(): Promise<Habit[]> {
    return this.habitModel.find({ isArchived: true }).sort({ updatedAt: -1 }).exec();
  }
  

  async markAsCompleted(id: string): Promise<Habit> {
    const habit = await this.habitModel.findById(id);

    if (!habit) {
      throw new NotFoundException(`Habit with ID "${id}" not found`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompleted = habit.completedDates.some(
      (date) => new Date(date).getTime() === today.getTime(),
    );

    if (alreadyCompleted) {
      throw new BadRequestException('Habit already marked as completed today');
    }

    habit.completedDates.push(today);
    return habit.save();
  }

  async calculateStreak(id: string): Promise<number> {
    const habit = await this.habitModel.findById(id);

    if (!habit) {
      throw new NotFoundException(`Habit with ID "${id}" not found`);
    }

    const completedDates = habit.completedDates
      .map((date) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());

    let streak = 0;
    let previousDate: Date | null = null;

    for (const date of completedDates) {
      if (!previousDate) {
        streak = 1;
      } else {
        const diffInDays =
          (date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays === 1) {
          streak++;
        } else if (diffInDays > 1) {
          streak = 1;
        }
      }
      previousDate = date;
    }

    habit.streak = streak;
    await habit.save();
    return streak;
  }
}
