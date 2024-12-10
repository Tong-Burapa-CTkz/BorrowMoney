import { Decimal } from '@prisma/client/runtime/library';
import { IsString, IsEmail, IsDecimal, Length } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateBalanceDto {

@IsString()
@Length(1,100)
    id: UUID

@IsDecimal()
  @Length(1, 100)
  amount: Decimal;

@IsString()
    @Length(1,100)
    operate: string;
}

