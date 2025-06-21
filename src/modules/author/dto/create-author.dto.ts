import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Anjan', description: 'Author\'s first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Das', description: 'Author\'s last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'Bestselling fantasy novelist' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: '1994-05-18', type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
