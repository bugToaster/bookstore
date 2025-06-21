// src/modules/book/book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { CreateBookDto } from './dto/create-book.dto';

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

  findAll(): Promise<Book[]> {
    return this.bookRepo.find({ relations: ['author'] });
  }

  findOne(id: string): Promise<Book | null> {
    return this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  }
}
