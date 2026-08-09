import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import {
  PaymentWebhookResult,
  PaymentWebhookService,
} from './payment-webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class PaymentWebhookController {
  constructor(private readonly paymentWebhookService: PaymentWebhookService) {}

  @Post('payment')
  @ApiOperation({ summary: 'Bank payment notification webhook' })
  handlePayment(@Body() dto: PaymentWebhookDto): Promise<PaymentWebhookResult> {
    return this.paymentWebhookService.handlePaymentWebhook(dto);
  }
}
