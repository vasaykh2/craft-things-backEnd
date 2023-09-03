import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { OrdersModule } from './orders/orders.module';
import { createPostgresConfig } from './utils/configurations/postgres.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createPostgresConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    CardsModule,
    OrdersModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
