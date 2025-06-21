// src/modules/book/dto/create-book.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  Matches,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Matches(/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/, {
    message: 'ISBN must be in the format 978-3-16-148410-0',
  })
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  genre?: string;

  @IsUUID()
  authorId: string;
}
