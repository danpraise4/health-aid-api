import { Schema, model } from 'mongoose';
import paginate from '../../plugins/paginate.plugin';
import toJSON from '../../plugins/toJson.plugin';
import { CardToken } from '../../../../index';
import { Pagination } from '../../plugins/paginate.plugin';
import { PAYMENT_SOURCE } from '../../../../config/constants';

const CardTokenSchema = new Schema<CardToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  healthWorker: {
    type: Schema.Types.ObjectId,
    ref: 'HealthWorker',
  },
  tokenizedCard: String,
  source: {
    type: String,
    enum: Object.values(PAYMENT_SOURCE),
  },
  meta: Map,
});

CardTokenSchema.plugin(paginate);
CardTokenSchema.plugin(toJSON);

const CardToken: Pagination<CardToken> = model<
  CardToken,
  Pagination<CardToken>
>('CardToken', CardTokenSchema);

export default CardToken;
