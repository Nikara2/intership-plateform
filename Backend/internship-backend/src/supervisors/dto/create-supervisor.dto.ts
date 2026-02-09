import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateSupervisorDto {
  @IsUUID()
  user_id: string;  // compte user associé

  @IsUUID()
  @IsOptional()
  company_id?: string; // entreprise qui crée le superviseur

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
