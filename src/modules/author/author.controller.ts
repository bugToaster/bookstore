import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    return this.authorService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
  ) {
    return this.authorService.findAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      firstName,
      lastName,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.authorService.remove(id);
  }
}
