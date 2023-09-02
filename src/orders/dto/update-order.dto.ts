import { PartialType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
