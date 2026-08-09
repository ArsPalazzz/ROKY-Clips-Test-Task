export class DuplicatePaymentError extends Error {
  constructor(paymentId: string) {
    super(`Payment ${paymentId} already exists`);
    this.name = 'DuplicatePaymentError';
  }
}
