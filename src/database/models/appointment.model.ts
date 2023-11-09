import { Schema, model } from 'mongoose';
import paginate, { Pagination } from '../plugins/paginate.plugin';
import toJSON from '../plugins/toJson.plugin';
import {
  APPOINTMENT_TYPE,
  APPOINTMENT_CHANNEL,
  PAYMENT_STATUS,
  APPOINTMENT_STATUS,
} from '../../../config/constants';
import { Appointment } from '../../..';

const appointmentSchema = new Schema<Appointment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    healthWorker: {
      type: Schema.Types.ObjectId,
      ref: 'HealthWorker',
    },
    channel: {
      type: String,
      enum: Object.values(APPOINTMENT_CHANNEL),
    },
    type: {
      type: String,
      enum: Object.values(APPOINTMENT_TYPE),
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    symptoms: [String],
    meta: Map,
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.plugin(toJSON);
appointmentSchema.plugin(paginate);

const Appointment: Pagination<Appointment> = model<
  Appointment,
  Pagination<Appointment>
>('Appointment', appointmentSchema);

export default Appointment;

/**
 * fields: GENDER OF HEALTH WORKER, SYMPTOMS, GENDER OF THE ACTOR,
 */
