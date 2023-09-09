import Joi from 'joi';
import { RIDE_TYPE, SUBSCRIPTION_TYPE } from '../../config/constants';
import objectId from './custom.validator';

export const initializeSubscriptionValidation = Joi.object().keys({
  user: Joi.custom(objectId).required(),
  name: Joi.string().required(),
  pickupDays: Joi.array().items(Joi.string()).required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  type: Joi.string()
    .required()
    .valid(...Object.values(SUBSCRIPTION_TYPE)),
  pickup: Joi.object().keys({
    location: Joi.string().required(),
    coordinates: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
  }),
  members: Joi.when('type', {
    is: RIDE_TYPE.GROUP_SUBSCRIPTION,
    then: Joi.array().items(Joi.custom(objectId).required()).required(),
  }),
  destination: Joi.array()
    .items({
      distance: Joi.number().required(),
      duration: Joi.number().required(),
      location: Joi.string().required(),
      coordinates: Joi.object().keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    })
    .required(),
  toAndFro: Joi.boolean().required(),
  firstTripTime: Joi.string().required(),
  secondTripTime: Joi.when('toAndFro', {
    is: true,
    then: Joi.string().required(),
  }),
});

export const acceptRideSubscriptionRequest = Joi.object().keys({
  subscription: Joi.custom(objectId).required(),
  ride: Joi.custom(objectId).required(),
  user: Joi.custom(objectId).required(),
});

export const acceptGroupSubscriptionRequest = {
  body: Joi.object().keys({
    subscription: Joi.custom(objectId).required(),
    pickup: Joi.object().keys({
      location: Joi.string().required(),
      coordinates: Joi.object().keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    }),
    destination: Joi.object()
      .keys({
        distance: Joi.number().required(),
        duration: Joi.number().required(),
        location: Joi.string().required(),
        coordinates: Joi.object().keys({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
        }),
      })
      .required(),
  }),
};
