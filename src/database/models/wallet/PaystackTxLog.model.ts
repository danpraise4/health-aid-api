import { Schema, model } from 'mongoose';
import toJSON from '../../plugins/toJson.plugin';
import paginate from '../../plugins/paginate.plugin';
import auditableFields from '../../plugins/auditableFields.plugin';
import { PAYSTACK_TRANSACTION_STATUS } from '../../../../config/constants';
import { PaystackTransactionLog } from '../../../../index.d';
import { Pagination } from '../../plugins/paginate.plugin';

const PaystackTransactionLogSchema = new Schema<PaystackTransactionLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(PAYSTACK_TRANSACTION_STATUS),
    },
    amount: Number,
    reference: String,
    currency: String,
    ...auditableFields,
  },
  {
    timestamps: true,
  },
);

PaystackTransactionLogSchema.plugin(toJSON);
PaystackTransactionLogSchema.plugin(paginate);

const PaystackTransactionLog: Pagination<PaystackTransactionLog> = model<
  PaystackTransactionLog,
  Pagination<PaystackTransactionLog>
>('PaystackTransactionLog', PaystackTransactionLogSchema);

export default PaystackTransactionLog;
