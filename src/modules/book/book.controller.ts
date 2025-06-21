import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('Books')
@ApiExtraModels(UpdateBookDto)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  async create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of books with optional filters' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'title', required: false, example: 'Life of Pi' })
  @ApiQuery({ name: 'isbn', required: false, example: '978-0-06-085052-4' })
  @ApiQuery({ name: 'authorId', required: false, example: 'uuid-author-id' })
  @ApiResponse({ status: 200, description: 'List of books' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('title') title?: string,
    @Query('isbn') isbn?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.bookService.findAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      title,
      isbn,
      authorId: authorId ? authorId : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single book by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const book = await this.bookService.findOne(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing book by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.bookService.remove(id);
  }
}
