import { PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;
}
