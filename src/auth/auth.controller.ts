
import { AuthService } from './auth.service';
import { Body, Controller, Injectable, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login-dto';

const authService = new AuthService();

@Controller('auth')
export class AuthController {
  
  constructor(private readonly prisma: PrismaService){}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await authService.validatePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = authService.generateToken({ userId: user.id, email });

    return { token };
  }
}