import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { IsDate, IsString, Min, Max, IsUrl, IsNumber } from 'class-validator';

import { Order } from 'src/orders/entities/order.entity';

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

  @ManyToMany(() => Order)
  @JoinTable()
  orders: Order[];
}
