import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Books E2E', () => {
  let app: INestApplication;
  let authorId: string;
  let bookId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();

    // Create an author for book association
    const res = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Anjan',
        lastName: 'Das',
        bio: 'Author of Brave New World',
        birthDate: '1994-05-18',
      });

    authorId = res.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /books - should create a book', async () => {
    const res = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'Life of Pi',
        isbn: '978-0-06-085052-4',
        publishedDate: '2001-01-01',
        genre: 'Novel',
        authorId,
      })
      .expect(201);

    bookId = res.body.id;
    expect(res.body.title).toBe('Life of Pi');
    expect(res.body.author.id).toBe(authorId);
  });

  it('GET /books - should return paginated list with filter', async () => {
    const res = await request(app.getHttpServer())
      .get(`/books?page=1&limit=5&title=life&authorId=${authorId}`)
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);

    const found = res.body.data.find((b) => b.id === bookId);
    expect(found).toBeDefined();
    expect(found.author.id).toBe(authorId);
  });

  it('GET /books/:id - should get the book', async () => {
    const res = await request(app.getHttpServer())
      .get(`/books/${bookId}`)
      .expect(200);
    expect(res.body.id).toBe(bookId);
    expect(res.body.author.id).toBe(authorId);
  });

  it('PATCH /books/:id - should update genre', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/books/${bookId}`)
      .send({ genre: 'Psychological Fiction' })
      .expect(200);
    expect(res.body.genre).toBe('Psychological Fiction');
  });

  it('DELETE /books/:id - should delete the book', async () => {
    await request(app.getHttpServer())
      .delete(`/books/${bookId}`)
      .expect(204);
  });

  it('GET /books/:id - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/books/${bookId}`)
      .expect(404);
  });
});
