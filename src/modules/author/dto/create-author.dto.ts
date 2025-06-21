import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
