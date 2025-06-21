import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  Matches,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'Life of Pi',
    description: 'Title of the book',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '978-0-06-085052-4',
    description: 'ISBN number (format: 978-3-16-148410-0)',
  })
  @IsNotEmpty()
  @Matches(/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/, {
    message: 'ISBN must be in format 978-3-16-148410-0',
  })
  isbn: string;

  @ApiPropertyOptional({
    example: '2001-01-01',
    description: 'Date when the book was published (ISO format)',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiPropertyOptional({
    example: 'Novel',
    description: 'Genre of the book',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    example: '9aab3c1e-f345-45d8-b222-78f5c9d2f111',
    description: 'UUID of the associated author',
    format: 'uuid',
  })
  @IsUUID()
  authorId: string;
}
