import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

const mockAuthor: Author = {
  id: 'author-uuid',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Author Bio',
  birthDate: new Date('1990-01-01'),
  books: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBook: Book = {
  id: 'book-uuid',
  title: 'Life of Pi',
  isbn: '978-0-06-085052-4',
  publishedDate: new Date('2001-01-01'),
  genre: 'Novel',
  author: mockAuthor,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BookService', () => {
  let service: BookService;
  let bookRepo: jest.Mocked<Repository<Book>>;
  let authorRepo: jest.Mocked<Repository<Author>>;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockBook], 1]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            merge: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Author),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(BookService);
    bookRepo = module.get(getRepositoryToken(Book));
    authorRepo = module.get(getRepositoryToken(Author));
  });

  it('should create a book if author exists', async () => {
    const dto: CreateBookDto = {
      title: 'Life of Pi',
      isbn: '978-0-06-085052-4',
      publishedDate: new Date('2001-01-01'),
      genre: 'Novel',
      authorId: 'author-uuid',
    };

    authorRepo.findOneBy.mockResolvedValue(mockAuthor);
    bookRepo.create.mockReturnValue(mockBook);
    bookRepo.save.mockResolvedValue(mockBook);

    const result = await service.create(dto);
    expect(authorRepo.findOneBy).toHaveBeenCalledWith({ id: dto.authorId });
    expect(bookRepo.create).toHaveBeenCalled();
    expect(bookRepo.save).toHaveBeenCalled();
    expect(result).toEqual(mockBook);
  });

  it('should throw if author not found during create', async () => {
    authorRepo.findOneBy.mockResolvedValue(null);
    const dto: CreateBookDto = { ...mockBook, authorId: 'invalid-id' };

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should return paginated books', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('should find one book by ID', async () => {
    bookRepo.findOne.mockResolvedValue(mockBook);

    const result = await service.findOne('book-uuid');
    expect(result).toEqual(mockBook);
  });

  it('should return null if book not found in findOne', async () => {
    bookRepo.findOne.mockResolvedValue(null);
    const result = await service.findOne('invalid-id');
    expect(result).toBeNull();
  });

  it('should update a book and change author if authorId provided', async () => {
    const updateDto: UpdateBookDto = {
      title: 'Updated Title',
      authorId: 'author-uuid',
    };

    bookRepo.findOne.mockResolvedValue(mockBook);
    authorRepo.findOneBy.mockResolvedValue(mockAuthor);
    bookRepo.merge.mockReturnValue({ ...mockBook, ...updateDto });
    bookRepo.save.mockResolvedValue({ ...mockBook, ...updateDto });

    const result = await service.update('book-uuid', updateDto);
    expect(result.title).toBe('Updated Title');
  });

  it('should throw if book not found during update', async () => {
    bookRepo.findOne.mockResolvedValue(null);
    await expect(service.update('invalid-id', {})).rejects.toThrow(NotFoundException);
  });

  it('should throw if new author not found during update', async () => {
    bookRepo.findOne.mockResolvedValue(mockBook);
    authorRepo.findOneBy.mockResolvedValue(null);
    await expect(service.update('book-uuid', { authorId: 'invalid-id' })).rejects.toThrow(NotFoundException);
  });

  it('should remove a book if found', async () => {
    bookRepo.findOneBy.mockResolvedValue(mockBook);
    bookRepo.remove.mockResolvedValue(mockBook);

    await expect(service.remove('book-uuid')).resolves.toBeUndefined();
    expect(bookRepo.remove).toHaveBeenCalledWith(mockBook);
  });

  it('should throw if book not found during remove', async () => {
    bookRepo.findOneBy.mockResolvedValue(null);
    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
