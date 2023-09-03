import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { TransformOwnerInterceptor } from '../utils/interceptors/transform-owner-interceptor';

@Controller('cards')
@UseGuards(ThrottlerGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateCardDto,
  ): Promise<Record<string, never>> {
    return await this.cardsService.createCard(dto, user);
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAllWishes(): Promise<Card[]> {
    return await this.cardsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformOwnerInterceptor<Card[]>)
  async getWishById(@Param('id') id: string): Promise<Card> {
    return await this.cardsService.findById(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<Record<string, never>> {
    return await this.cardsService.updateCard(Number(id), dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformOwnerInterceptor<Card>)
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Card> {
    return await this.cardsService.deleteById(Number(id), user.id);
  }
}
