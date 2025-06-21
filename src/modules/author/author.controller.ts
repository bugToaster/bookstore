import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    return this.authorService.create(dto);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const author = await this.authorService.findOne(id);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }
}
