import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAndRepayLendDto } from './dto/request/create-and-repay-lend.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Status } from '@prisma/client';
import { TransactionType } from '@prisma/client';


@Injectable()
export class LendService {

  constructor(private readonly prisma: PrismaService) {}

  async createLend(createLendDto: CreateAndRepayLendDto) {
    try {
      const lendmoney = await this.prisma.$transaction(async (prisma) => {
  
        // Lender
        const existingLender = await prisma.user.findFirst({
          where: { name: createLendDto.lenderName },
        });
  
        if (!existingLender) {
          throw new NotFoundException('Lender not found');
        }
  
        // Borrower
        const existingBorrower = await prisma.user.findFirst({
          where: { name: createLendDto.borrowName },
        });
  
        if (!existingBorrower) {
          throw new NotFoundException('Borrower not found');
        }
  
        const LenderAccount = await prisma.account.findFirst({
          where: { userId: existingLender.id },
        });
  
        if (!LenderAccount) {
          throw new NotFoundException('Lender account not found');
        }
  
        if (LenderAccount.balance < createLendDto.amount) {
          throw new BadRequestException('Lender has insufficient balance');
        }
  
        const updateBalanceLender = await prisma.account.update({
          where: { userId: LenderAccount.userId },
          data: {
            balance: {
              decrement: Number(createLendDto.amount),
            },
          },
        });
  
        const updateBalanceBorrower = await prisma.account.update({
          where: { userId: existingBorrower.id },
          data: {
            balance: {
              increment: Number(createLendDto.amount),
            },
          },
        });
  
        const newTransaction = await prisma.transaction.create({
          data: {
            sender_id: existingLender.id,
            reciever_id: existingBorrower.id,
            amount: createLendDto.amount,
            type: TransactionType.LEND,
            status: Status.SUCCESS,
          },
        });
  
        return {
          message: `Borrow money from ${createLendDto.lenderName} amount ${createLendDto.amount} completed`,
        };
      });
  
      return lendmoney;
    } catch (error) {
      console.error('Error:', error);
  
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }
  
      throw new Error('Unable to process request, please try again later');
    }
  }

  async createRepay(createPayDto: CreateAndRepayLendDto) {
    try{
      const lendmoney = await this.prisma.$transaction(async (prisma) => {

        // Lender
        const existingLender = await prisma.user.findFirst({
          where: { name: createPayDto.lenderName },
        });
      
        if (!existingLender) {
          throw new NotFoundException({message:'Lender not found'});
        }

        // Borrower
        const existingBorrower = await prisma.user.findFirst({
          where: { name: createPayDto.borrowName },
        });
      
        if (!existingBorrower) {
          throw new NotFoundException('Borrower not found');
        }
      

        const borrowerAccount = await prisma.account.findFirst({
          where: { userId: existingBorrower.id },
        });
      
        if (borrowerAccount.balance < createPayDto.amount) {
          throw new BadRequestException('Borrower has insufficient balance');
        }

        const updateBalanceLender = await prisma.account.update({
          where: {userId: borrowerAccount.userId },
          data: {
            balance: {
              decrement: Number(createPayDto.amount), 
            },
          },
        })

        const updateBalanceBorrower = await prisma.account.update({
          where: {userId: existingLender.id },
          data: {
            balance: {
              increment: Number(createPayDto.amount), 
            },
          },
        })

        const newTransection = await prisma.transaction.create({
          data: {
          sender_id : existingBorrower.id,
          reciever_id: existingLender.id,
          amount: createPayDto.amount,
          type : TransactionType.REPAY,
          status: Status.SUCCESS,
          },
        });

        return { message: "Return money to " + createPayDto.lenderName + "amount " + createPayDto.amount + " completed"}; 

      });

      return lendmoney
    }
    catch (error){
      console.error("Error " , error)

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Unable to transfer at this time. Please try again later.');
    }
  }

  async getDebtSummary(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const totalLendList = await this.prisma.transaction.aggregate({
        where: { reciever_id: userId, type: 'LEND', status: 'SUCCESS' },
        _sum: { amount: true },
      });

      const totalRepaidList = await this.prisma.transaction.aggregate({
        where: { reciever_id: userId, type: 'REPAY', status: 'SUCCESS' },
        _sum: { amount: true },
      });

      const totalLendAmount = totalLendList? totalLendList._sum.amount?.toNumber() ?? 0 : 0;
      const totalRepaidAmount = totalRepaidList ? totalRepaidList._sum.amount?.toNumber() ?? 0 : 0;

      const debtBalance = totalLendAmount - totalRepaidAmount;

      let resultMessage = 'You have no debt';
      if (debtBalance > 0) {
        resultMessage = `You have debt of ${Math.abs(debtBalance)}`;
      }

      return {
        result : resultMessage,
      };
    }
    catch (error){
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Unable to process request, please try again later');
    }
  }

  async getTransactions(userId: string, otherUserId?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const otherUser = await this.prisma.user.findUnique({
        where: { id: otherUserId },
      });
    
      if ((!user) && (!otherUser) ) {
        throw new NotFoundException('User not found');
      }

    const whereCondition = otherUserId
    ? { senderId: userId, receiverId: otherUserId }
    : { senderId: userId };

    const transactions = await this.prisma.transaction.findMany({
      where: otherUserId
        ? { sender_id: userId, reciever_id: otherUserId } 
        : { sender_id: userId },
      orderBy: { createdAt: 'desc' },
    });
    
      return transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        type:
          transaction.sender_id === userId
            ? 'SENT'
            : transaction.reciever_id === userId
            ? 'RECEIVED'
            : 'UNKNOWN',
        status: transaction.status,
        counterpart: transaction.sender_id === userId ? transaction.reciever_id : transaction.sender_id,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      }));
    }
    catch (error){
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Unable to process request, please try again later');
    }
  }
}
