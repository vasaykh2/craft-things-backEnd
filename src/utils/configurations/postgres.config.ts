import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Order } from 'src/orders/entities/order.entity';

export const createPostgresConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [User, Card, Order],
    synchronize: configService.get('POSTGRES_SYNCHRONIZE'),
  };
};
