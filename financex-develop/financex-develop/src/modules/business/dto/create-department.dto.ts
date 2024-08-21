import { IsEmail, IsString } from 'class-validator';

export class CreateBusinessDepartmentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
