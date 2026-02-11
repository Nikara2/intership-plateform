import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateSettingsDto {
  // General Settings
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  date_format?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  // Notification Settings
  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  new_applications?: boolean;

  @IsOptional()
  @IsBoolean()
  new_accounts?: boolean;

  @IsOptional()
  @IsBoolean()
  weekly_report?: boolean;

  @IsOptional()
  @IsBoolean()
  system_updates?: boolean;

  // Platform Settings
  @IsOptional()
  @IsBoolean()
  allow_registration?: boolean;

  @IsOptional()
  @IsBoolean()
  require_email_verification?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  default_offer_duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  max_applications_per_student?: number;

  @IsOptional()
  @IsBoolean()
  auto_close_expired_offers?: boolean;
}
