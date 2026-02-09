import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentApplicationHistory } from './student-application-history.entity';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentApplicationHistory])],
  providers: [HistoriesService],
  controllers: [HistoriesController],
  exports: [HistoriesService],
})
export class HistoriesModule {}
