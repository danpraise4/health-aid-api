import cronJob from 'node-cron';
import PaystackTransactionLog from './database/models/wallet/PaystackTxLog.model';
import { PAYSTACK_TRANSACTION_STATUS } from '../config/constants';
import { paymentService } from './http/controllers/controllers.module';
export default class CronJobs {
  static async start() {
    const verifyPaymentCallback = cronJob.schedule('* * * * *', async () => {
      const paystackTxLog = await PaystackTransactionLog.find({
        status: PAYSTACK_TRANSACTION_STATUS.PENDING,
      });
      await Promise.all(
        paystackTxLog.map(async (log) => {
          const transaction = await paymentService.verifyPayment(log.reference);
          if (!transaction) {
            throw new Error('Transaction not found');
          }
          if (transaction.data.status !== 'success') return null;
          const payload = await paymentService.processChargeSuccess(
            transaction.data,
          );
          return payload;
        }),
      );
    });
    verifyPaymentCallback.start();
  }
}
