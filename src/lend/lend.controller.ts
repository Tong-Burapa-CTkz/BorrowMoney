import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LendService } from './lend.service';
import { CreateAndRepayLendDto } from './dto/request/create-and-repay-lend.dto';


@Controller('lend')
export class LendController {
  constructor(private readonly lendService: LendService) {}

  // @UseGuards(AuthGuard)
  @Post('/lendmoney')
  async createLend(@Body() createLendDto: CreateAndRepayLendDto) {
    var test = this.lendService.createLend(createLendDto);
    console.log("responseapi : " + test);

    return test
  }

  // @UseGuards(AuthGuard)
  @Post('/repaymoney')
  async createRepay(@Body() repayLendDto: CreateAndRepayLendDto) {
    return this.lendService.createRepay(repayLendDto);
  }

  // @UseGuards(AuthGuard)
  @Get('summary/:userId')
  async getDebt(@Param('userId') userId: string){
    return this.lendService.getDebtSummary(userId);
  }

  // @UseGuards(AuthGuard)
  @Get('transaction/:userId/:otherUserId')
  async getTransactions(@Param('userId') userId: string, @Query('otherId') otherUserId?: string) {
    return this.lendService.getTransactions(userId, otherUserId);
  }
}
