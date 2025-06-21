import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  Matches,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Matches(/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/, {
    message: 'ISBN must be in format 978-3-16-148410-0',
  })
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsUUID()
  authorId: string;
}