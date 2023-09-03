import { ThrottlerGuard } from '@nestjs/throttler';
import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { TransformOwnerInterceptor } from 'src/utils/interceptors/transform-owner-interceptor';
import { Order } from './entities/order.entity';

@Controller('orders')
@UseGuards(JwtGuard)
@UseGuards(ThrottlerGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(TransformOwnerInterceptor<Order>)
  async createOrder(
    @Req() { user }: { user: User },
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.createOrder(dto, user);
  }

  @Patch(':id')
  @UseInterceptors(TransformOwnerInterceptor<Order>)
  async updateOrder(
    @Req() { user }: { user: User },
    @Param('id') cardId: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrder(Number(cardId), dto, user.id);
  }

  @Get()
  @UseInterceptors(TransformOwnerInterceptor<Order[]>)
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.findAllOrders();
  }

  @Get(':id')
  @UseInterceptors(TransformOwnerInterceptor<Order>)
  async getOrderById(@Param('id') cardId: string): Promise<Order> {
    const order = await this.ordersService.findById(Number(cardId));

    return order;
  }

  @Delete(':id')
  @UseInterceptors(TransformOwnerInterceptor<Order>)
  async deleteOrder(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Order> {
    return await this.ordersService.deleteById(id, user.id);
  }
}
