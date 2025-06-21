import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
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

  @ApiPropertyOptional({
    example: '1994-05-18',
    type: 'string',
    format: 'date',
    description: 'Author birth date (ISO 8601)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;
}
