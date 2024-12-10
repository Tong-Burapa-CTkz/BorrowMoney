import { BadRequestException, ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<{ statusCode: number; message: string }> {
    const { name, email, password } = createUserDto;
  
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { email },
      });
  
      if (existingUser) {
        return {
          statusCode: 403,
          message: "Account already exists.",
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prisma.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
  
        await prisma.account.create({
          data: {
            userId: newUser.id,
            balance: 0.0,
          },
        });
      });
  
      return {
        statusCode: 200,
        message: "User created successfully.",
      };
    } catch (e) {
      console.error("Error " , e)
      throw new Error("Unable to create account. Please try again later.");
    }
  }

  async updateBalance(updateBalanceDto: UpdateBalanceDto): Promise<{ statusCode: number; message: string }> {
    const { id, amount, operate } = updateBalanceDto;
  
    try {
      if (!['withdraw', 'deposit'].includes(operate)) {
        return {
          statusCode: 400,
          message: `Invalid operation: ${operate}. Supported operations are 'withdraw' and 'deposit'.`,
        };
      }
      const account = await this.prisma.account.findUnique({
        where: { userId: id },
      });

      if (!account) {
        return{
          statusCode: 404,
          message: "Account not found.",
        };
      }

      const operationType = operate === 'withdraw' ? 'decrement' : 'increment';

      if (operate === 'withdraw' && account.balance < amount) {
        return {
          statusCode: 400,
          message: "Insufficient balance.",
        };
      }
  
      const updatedBalance = await this.prisma.account.update({
        where: { userId: id },
        data: {
          balance: {
            [operationType]: Number(amount),
          },
        },
      });
  
      const operationMessage = operate === 'withdraw' ? 'Withdraw complete' : 'Deposit complete';
  
      return {statusCode: 200, message: operationMessage + " Amount: " + amount};
    } catch (e) {
      console.error("Error " , e)
      throw new Error('Unable to update balance at this time. Please try again later.');
    }
  }

}
