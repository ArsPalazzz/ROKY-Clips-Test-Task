import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @ApiProperty({ example: 'abc-123' })
  @IsString()
  payment_id: string;

  @ApiProperty({ example: 42 })
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({ example: 4900 })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'CONFIRMED' })
  @IsString()
  status: string;
}
