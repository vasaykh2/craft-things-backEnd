import { NotFoundException } from '@nestjs/common/exceptions';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { USER_NOT_OWNER, CARD_NOT_FOUND } from 'src/utils/constants/cards';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Card[]> {
    const cards = await this.cardsRepository.find();
    return cards;
  }

  async findManyByIdArr(idArr: number[]): Promise<Card[]> {
    return this.cardsRepository.find({
      where: { id: In(idArr) },
    });
  }

  async createCard(
    CreateCardDto: CreateCardDto,
    user: User,
  ): Promise<Record<string, never>> {
    await this.cardsRepository.save({
      ...CreateCardDto,
      owner: user,
    });

    return {};
  }

  async findById(id: number): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!card) {
      throw new NotFoundException('По запросу ничего не найдено');
    }

    return card;
  }

  async updateCard(
    cardId: number,
    UpdateCardDto: UpdateCardDto,
    userId: number,
  ): Promise<Record<string, never>> {
    const card = await this.findById(cardId);

    if (!card) {
      throw new NotFoundException(CARD_NOT_FOUND);
    }

    if (card.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    await this.cardsRepository.update(cardId, UpdateCardDto);

    return {};
  }

  async updateCardOrdered(
    cardId: number,
    ordered: number,
  ): Promise<Record<string, never>> {
    await this.cardsRepository.update(cardId, { ordered });
    return {};
  }

  async deleteById(cardId: number, userId: number): Promise<Card> {
    const card = await this.findById(cardId);
    if (!card) {
      throw new NotFoundException(CARD_NOT_FOUND);
    }

    if (card.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    await this.cardsRepository.delete(cardId);

    return card;
  }
}
