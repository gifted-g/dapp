import { IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;
}
