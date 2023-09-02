import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import {
  USER_NOT_OWNER,
  ORDER_NOT_FOUND,
  CART_IS_EMPTY,
} from 'src/utils/constants/orders';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly cardsService: CardsService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {
    const cardsArr = await this.cardsService.findManyByIdArr(
      createOrderDto.itemsId,
    );

    if (!cardsArr.length) {
      throw new NotFoundException(CART_IS_EMPTY);
    }

    return await this.ordersRepository.save({
      ...createOrderDto,
      owner: user,
      items: cardsArr,
    });
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }

    return order;
  }

  async deleteById(orderId: number, userId: number): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }

    if (order.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    await this.ordersRepository.delete(orderId);

    return order;
  }

  async updateOrder(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
    userId: number,
  ): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }

    if (order.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    const cardsArr = await this.cardsService.findManyByIdArr(
      updateOrderDto.itemsId || [],
    );

    return await this.ordersRepository.save({
      ...order,
      items: cardsArr.concat(order.items),
    });
  }

  async updateOrderPrepaid(
    orderId: number,
    prepaid: boolean,
  ): Promise<Record<string, never>> {
    await this.ordersRepository.update(orderId, { prepaid });
    return {};
  }

  async updateOrderDelivered(
    orderId: number,
    delivered: boolean,
  ): Promise<Record<string, never>> {
    await this.ordersRepository.update(orderId, { delivered });
    return {};
  }
}
