import { ThrottlerGuard } from '@nestjs/throttler';
import { NotFoundException } from '@nestjs/common/exceptions';
import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  //Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
//import { USER_DOES_NOT_EXIST } from '../utils/constants/users';
//import { TransformOwnerInterceptor } from '../utils/interceptors/transform-owner-interceptor';
import { TransformPrivateUserInterceptor } from '../utils/interceptors/transform-private-user-interceptor';
//import { TransformPublicUserInterceptor } from '../utils/interceptors/transform-public-user-interceptor';

@Controller('users')
@UseGuards(JwtGuard)
@UseGuards(ThrottlerGuard)
@UseInterceptors(TransformPrivateUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<User> {
    const userProfileData = await this.usersService.findById(user.id);

    if (!userProfileData) {
      throw new NotFoundException();
    }

    return userProfileData;
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateById(user.id, dto);
  }
}
