import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSupervisorWithUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;
}
