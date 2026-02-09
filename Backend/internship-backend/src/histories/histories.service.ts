import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentApplicationHistory } from './student-application-history.entity';
import { HistoryQueryDto } from './dto/history-query.dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(StudentApplicationHistory)
    private readonly historyRepository: Repository<StudentApplicationHistory>,
  ) {}

  async findAll(filters?: Partial<HistoryQueryDto>) {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters || {}).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    return this.historyRepository.find({
      where: cleanedFilters,
      order: { completed_at: 'DESC' },
    });
  }

  async create(history: Partial<StudentApplicationHistory>) {
    const record = this.historyRepository.create(history);
    return this.historyRepository.save(record);
  }
}
