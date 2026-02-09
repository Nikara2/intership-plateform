import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateOfferDto {
  @IsUUID()
  @IsOptional()
  company_id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  // 🔹 Date limite de candidature
  @IsDateString()
  deadline: string;
}
