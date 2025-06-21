import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiPropertyOptional({ example: 'Updated genre name' })
  genre?: string;
}
