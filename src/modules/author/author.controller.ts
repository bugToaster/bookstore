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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author created successfully' })
  create(@Body() dto: CreateAuthorDto) {
    return this.authorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of authors with optional search & pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'firstName', required: false, example: 'John' })
  @ApiQuery({ name: 'lastName', required: false, example: 'Doe' })
  @ApiResponse({ status: 200, description: 'List of authors' })
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
  @ApiOperation({ summary: 'Get a single author by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Author found' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Author updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an author by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Author deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.authorService.remove(id);
  }
}
