import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [TypeOrmModule.forFeature([Card]), UsersModule],
  exports: [CardsService],
})
export class CardsModule {}
