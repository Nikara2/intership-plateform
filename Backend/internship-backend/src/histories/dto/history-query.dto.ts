import { IsOptional, IsUUID } from 'class-validator';

export class HistoryQueryDto {
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @IsUUID()
  @IsOptional()
  company_id?: string;

  @IsUUID()
  @IsOptional()
  supervisor_id?: string;
  application_id: any;
  offer_id: any;
  status: any;
}
