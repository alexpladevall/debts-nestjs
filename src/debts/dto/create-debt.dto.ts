import { IsMongoId, IsNumber, IsString, NotEquals } from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @IsMongoId()
  readonly withUserId: string;

  @IsNumber()
  @NotEquals(0, { message: 'quantity cannot be 0' })
  readonly quantity: number;
}
