import { Controller, Get, Post, Body, Put, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.userService.createUser(createUserDto);
    return res.status(result.statusCode).json({ message: result.message });
  }

  @Put('/balance')
  async updateBalance(@Body() updateBalance: UpdateBalanceDto, @Res() res: Response) {
    const result = await this.userService.updateBalance(updateBalance);
    return res.status(result.statusCode).json({ message: result.message });
  }

}
