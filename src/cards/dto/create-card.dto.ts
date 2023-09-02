import { IsNumber, IsPositive, IsString, IsUrl, Length } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
