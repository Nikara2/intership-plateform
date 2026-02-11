import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async getSettings(userId: string): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({
      where: { user_id: userId },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = this.settingsRepository.create({ user_id: userId });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async updateSettings(
    userId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({
      where: { user_id: userId },
    });

    if (!settings) {
      // Create new settings if not exists
      settings = this.settingsRepository.create({
        user_id: userId,
        ...updateSettingsDto,
      });
    } else {
      // Update existing settings
      Object.assign(settings, updateSettingsDto);
    }

    return this.settingsRepository.save(settings);
  }
}
