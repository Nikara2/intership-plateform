import { IsNotEmpty, IsOptional, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateEvaluationDto {
  @IsUUID()
  application_id: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number;
}
