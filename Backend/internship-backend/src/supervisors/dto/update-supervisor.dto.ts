import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSupervisorDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
