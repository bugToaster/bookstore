import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const author = await this.authorRepo.findOneBy({ id: dto.authorId });
    if (!author) throw new NotFoundException('Author not found');

    const book = this.bookRepo.create({
      ...dto,
      author,
    });

    return this.bookRepo.save(book);
  }

  async findAll(query: {
    page: number;
    limit: number;
    title?: string;
    isbn?: string;
    authorId?: string;
  }): Promise<{
    data: Book[];
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  }> {
    const { page, limit, title, isbn, authorId } = query;

    const qb = this.bookRepo.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    if (title) {
      qb.andWhere('LOWER(book.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (isbn) {
      qb.andWhere('LOWER(book.isbn) LIKE LOWER(:isbn)', {
        isbn: `%${isbn}%`,
      });
    }

    if (authorId) {
      qb.andWhere('book.authorId = :authorId', { authorId });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Book | null> {
    return this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);

    if (dto.authorId) {
      const newAuthor = await this.authorRepo.findOneBy({ id: dto.authorId });
      if (!newAuthor) {
        throw new NotFoundException(`Author with ID ${dto.authorId} not found`);
      }
      book.author = newAuthor;
    }

    const updated = this.bookRepo.merge(book, dto);
    return this.bookRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);

    await this.bookRepo.remove(book);
  }
}
