import { IsEmail, IsNotEmpty, IsEnum, MinLength, IsNotIn } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsNotIn([UserRole.SUPERVISOR, UserRole.STUDENT]) // Supervisors and students cannot self-register
  role: UserRole;
}
