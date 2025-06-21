import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @ApiPropertyOptional({ example: 'Updated bio', description: 'Updated biography' })
  bio?: string;
}
