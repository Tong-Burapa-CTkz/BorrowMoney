import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsString, Length } from "class-validator";

export class CreateAndRepayLendDto {

  @IsString()
  @Length(1, 100)
  borrowName: string;

  @IsString()
  @Length(1, 100)
  lenderName: string;

  @IsDecimal()
  @Length(1, 100)
  amount: Decimal;
  
  @IsString()
  @Length(1, 100)
  type: string;

}
