import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Author } from '../../author/entities/author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ nullable: true })
  genre?: string;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
