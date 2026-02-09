import { IsUUID, IsOptional, IsEnum } from 'class-validator';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export class ApplyDto {
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @IsUUID()
  offer_id: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}
