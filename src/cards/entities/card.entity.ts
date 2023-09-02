import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsString, Min, Max, IsUrl, IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @IsString()
  @Min(2)
  @Max(250)
  name: string;

  @Column()
  @IsString()
  @Min(1)
  @Max(1024)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @IsNumber()
  price: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  ordered: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}
