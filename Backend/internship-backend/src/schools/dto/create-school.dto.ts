import { IsString, IsOptional, IsInt, IsEmail } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postal_code?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsInt()
  @IsOptional()
  student_count?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsInt()
  @IsOptional()
  founded_year?: number;

  @IsString()
  @IsOptional()
  accreditations?: string;
}
