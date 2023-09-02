import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { IsDate, IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Card } from 'src/cards/entities/card.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({
    default: false,
  })
  @IsBoolean()
  prepaid: boolean;

  @Column({
    default: false,
  })
  @IsBoolean()
  delivered: boolean;

  @ManyToOne(() => User, (user) => user.orders)
  owner: User;

  @ManyToMany(() => Card)
  @JoinTable()
  items: Card[];
}
