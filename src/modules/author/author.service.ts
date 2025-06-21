import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  async create(dto: CreateAuthorDto): Promise<Author> {
    const author = this.authorRepo.create(dto);
    return await this.authorRepo.save(author);
  }

  async findAll(query: {
    page: number;
    limit: number;
    firstName?: string;
    lastName?: string;
  }) {
    const { page, limit, firstName, lastName } = query;

    const qb = this.authorRepo.createQueryBuilder('author');

    if (firstName) {
      qb.andWhere('LOWER(author.firstName) LIKE LOWER(:firstName)', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      qb.andWhere('LOWER(author.lastName) LIKE LOWER(:lastName)', {
        lastName: `%${lastName}%`,
      });
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

  async findOne(id: string): Promise<Author> {
    const author = await this.authorRepo.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: string, dto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    const updated = this.authorRepo.merge(author, dto);
    return await this.authorRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const author = await this.authorRepo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    if (author.books && author.books.length > 0) {
      throw new BadRequestException(
        `Cannot delete author with ${author.books.length} associated book(s).`,
      );
    }
    await this.authorRepo.remove(author);
  }

}
