import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from '../hash/hash.module';
import { User } from './entities/user.entity';
import { Card } from '../cards/entities/card.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Card]), HashModule],
  exports: [UsersService],
})
export class UsersModule {}
