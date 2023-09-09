import Joi from 'joi';
import { CARD_TYPES } from '../../config/constants';

export const withdrawal = {
  body: Joi.object().keys({
    amount: Joi.number().required().positive(),
    idempotentKey: Joi.string().required().min(16),
    bankCode: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    purpose: Joi.string().required(),
    nameEnquiryId: Joi.string().required(),
    senderName: Joi.string().required(),
  }),
};

export const validateAccount = {
  body: Joi.object().keys({
    bankCode: Joi.string().required(),
    accountNumber: Joi.string().required(),
  }),
};

export const transactionPin = {
  body: Joi.object().keys({
    pin: Joi.string().required().min(4).max(4),
  }),
};

export const inAppTransfer = {
  body: Joi.object().keys({
    amount: Joi.number().required().positive(),
    idempotentKey: Joi.string().required().min(16),
    walletNumber: Joi.string().required(),
  }),
};

export const cardPayment = {
  body: Joi.object().keys({
    amount: Joi.number().required().positive(),
    idempotentKey: Joi.string().required().min(24),
    type: Joi.string()
      .required()
      .valid(...Object.values(CARD_TYPES)),
    tokenizedCard: Joi.when('type', {
      is: CARD_TYPES.SAVED_CARD,
      then: Joi.string().required(),
    }),
  }),
};
