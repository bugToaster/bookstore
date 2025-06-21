import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  create(dto: CreateAuthorDto): Promise<Author> {
    const author = this.authorRepo.create(dto);
    return this.authorRepo.save(author);
  }

  findAll(): Promise<Author[]> {
    return this.authorRepo.find({ relations: ['books'] });
  }

  findOne(id: string): Promise<Author | null> {
    return this.authorRepo.findOne({ where: { id }, relations: ['books'] });
  }
}
