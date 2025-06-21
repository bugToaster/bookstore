import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Authors E2E', () => {
  let app: INestApplication;
  let createdAuthorId: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /authors - should create an author', async () => {
    const res = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Anjan',
        lastName: 'Das',
        bio: 'Author of 1994',
        birthDate: '1994-05-18',
      })
      .expect(201);

    createdAuthorId = res.body.id;
    expect(res.body.firstName).toBe('Anjan');
    expect(res.body.lastName).toBe('Das');
  });

  it('GET /authors - should return paginated list with the created author', async () => {
    const res = await request(app.getHttpServer())
      .get('/authors?page=1&limit=5&firstName=anj')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);
    expect(res.body.total).toBeGreaterThanOrEqual(1);

    const found = res.body.data.find((a) => a.id === createdAuthorId);
    expect(found).toBeDefined();
  });

  it('GET /authors/:id - should get the author', async () => {
    const res = await request(app.getHttpServer())
      .get(`/authors/${createdAuthorId}`)
      .expect(200);
    expect(res.body.id).toBe(createdAuthorId);
  });

  it('PATCH /authors/:id - should update the bio', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/authors/${createdAuthorId}`)
      .send({ bio: 'Updated bio' })
      .expect(200);
    expect(res.body.bio).toBe('Updated bio');
  });

  it('DELETE /authors/:id - should delete the author', async () => {
    await request(app.getHttpServer())
      .delete(`/authors/${createdAuthorId}`)
      .expect(204);
  });

  it('GET /authors/:id - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/authors/${createdAuthorId}`)
      .expect(404);
  });
});
