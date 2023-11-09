import Joi from 'joi';
import { APPOINTMENT_CHANNEL, APPOINTMENT_TYPE } from '../../config/constants';
import objectId from './custom.validator';

export const appointmentValidator = {
  body: Joi.object().keys({
    channel: Joi.string()
      .required()
      .valid(...Object.values(APPOINTMENT_CHANNEL)),
    appointmentDate: Joi.date().required(),
    symptoms: Joi.array().items(Joi.string()),
    meta: Joi.object(),
    type: Joi.string()
      .required()
      .valid(...Object.values(APPOINTMENT_TYPE)),
    card: Joi.string().optional(),
  }),
};

export const acceptAppointment = {
  params: {
    appointmentId: Joi.custom(objectId).required(),
  },
};
