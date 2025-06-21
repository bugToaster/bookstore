import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthorModule } from './modules/author/author.module';
import { BookModule } from './modules/book/book.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule, AuthorModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
