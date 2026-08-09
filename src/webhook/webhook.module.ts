import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentWebhookService } from './payment-webhook.service';

@Module({
  imports: [RepositoriesModule],
  controllers: [PaymentWebhookController],
  providers: [PaymentWebhookService],
})
export class WebhookModule {}
