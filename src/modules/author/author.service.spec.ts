import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockAuthor: Author = {
  id: 'uuid-123',
  firstName: 'Anjan',
  lastName: 'Das',
  bio: 'Test Bio',
  birthDate: new Date('1995-01-01'),
  books: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthorService', () => {
  let service: AuthorService;
  let repo: jest.Mocked<Repository<Author>>;
  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockAuthor], 1]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
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
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repo = module.get(getRepositoryToken(Author));
  });

  it('should create an author', async () => {
    const dto: CreateAuthorDto = {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Test Bio',
      birthDate: new Date('1990-01-01'),
    };
    const createdAuthor = { ...dto, id: 'uuid-123', books: [], createdAt: new Date(), updatedAt: new Date() };

    repo.create.mockReturnValue(createdAuthor as Author);
    repo.save.mockResolvedValue(createdAuthor as Author);

    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(createdAuthor);
    expect(result).toEqual(createdAuthor);
  });

  it('should return paginated authors', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('should find one author by ID', async () => {
    repo.findOne.mockResolvedValue(mockAuthor);

    const result = await service.findOne('uuid-123');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
      relations: ['books'],
    });
    expect(result).toEqual(mockAuthor);
  });

  it('should throw NotFoundException if author not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should update an author', async () => {
    const updateDto: UpdateAuthorDto = { bio: 'Updated Bio' };
    repo.findOne.mockResolvedValue(mockAuthor);
    repo.merge.mockReturnValue({ ...mockAuthor, ...updateDto });
    repo.save.mockResolvedValue({ ...mockAuthor, ...updateDto });

    const result = await service.update('uuid-123', updateDto);
    expect(repo.findOne).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result.bio).toBe('Updated Bio');
  });

  it('should remove an author with no books', async () => {
    const authorWithNoBooks = { ...mockAuthor, books: [] };
    repo.findOne.mockResolvedValue(authorWithNoBooks);
    repo.remove.mockResolvedValue(mockAuthor);

    await expect(service.remove('uuid-123')).resolves.toBeUndefined();
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
      relations: ['books'],
    });
    expect(repo.remove).toHaveBeenCalledWith(authorWithNoBooks);
  });

  it('should not remove an author with existing books', async () => {
    repo.findOne.mockResolvedValue({ ...mockAuthor, books: [{}] as any });

    await expect(service.remove('uuid-123')).rejects.toThrow(BadRequestException);
    expect(repo.remove).not.toHaveBeenCalled();
  });
});
