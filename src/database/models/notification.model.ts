import { Schema, model } from 'mongoose';
import toJSON from '../plugins/toJson.plugin';
import paginate, { Pagination } from '../plugins/paginate.plugin';
import { Notification } from '../../../index';
import auditableFields from '../plugins/auditableFields.plugin';
import { NOTIFICATION_TYPES, PORTFOLIO } from '../../../config/constants';

const notificationSchema = new Schema<Notification>(
  {
    title: String,
    message: {
      type: String,
      required: true,
      trim: true,
    },
    Patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    },
    Doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    meta: Object,
    read: Boolean,
    for: {
      type: String,
      enum: Object.values(PORTFOLIO),
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(NOTIFICATION_TYPES),
    },
    priority: {
      type: Number,
      default: 1,
    },
    ...auditableFields,
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

/**
 * @typedef Notification
 */
const Notification: Pagination<Notification> = model<
  Notification,
  Pagination<Notification>
>('Notification', notificationSchema);

export default Notification;
