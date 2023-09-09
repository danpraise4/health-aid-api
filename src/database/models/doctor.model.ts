/* eslint-disable no-param-reassign */

// WIP - Work in progress
import { Schema, model } from 'mongoose';
import paginate, { Pagination } from '../plugins/paginate.plugin';
import toJSON from '../plugins/toJson.plugin';
import { GENDER, PORTFOLIO, ACCOUNT_STATUS } from '../../../config/constants';
import auditableFields from '../plugins/auditableFields.plugin';
import { Doctor } from '../../../index';
import HelperClass from '../../utils/helper';

const DoctorSchema = new Schema<Doctor>(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
      // set: function (firstName: string) {
      //   return firstName.toLowerCase();
      // },
      get: function (firstName: string) {
        return HelperClass.titleCase(firstName);
      },
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      // set: function (lastName: string) {
      //   return lastName.toLowerCase();
      // },
      get: function (lastName: string) {
        return lastName.toUpperCase();
      },
    },
    middleName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    portfolio: {
      type: String,
      enum: Object.values(PORTFOLIO),
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    verifiedAt: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
    pushNotificationId: String,
    allowPushNotification: {
      type: Boolean,
      default: true,
    },
    DoctorAppVersion: String,
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    avatar: {
      url: String,
      publicId: String,
    },
    dob: {
      type: Date,
      required: false,
    },
    referralCode: String,
    inviteCode: String,
    deviceInfo: [Map],
    accountStatus: {
      status: {
        type: String,
        enum: Object.values(ACCOUNT_STATUS),
        default: ACCOUNT_STATUS.PENDING,
      },
      reason: String,
    },
    meta: {
      isDoctorAvailableForRide: {
        type: Boolean,
        default: true,
      },
      isDoctorAvailableForRideSubscription: {
        type: Boolean,
        default: true,
      },
      lastLogin: Date,
      bankName: String,
      accountNumber: String,
      DoctorLicenseNumber: String,
      carBrand: String,
      carModel: String,
      carColor: String,
      carPlateNumber: String,
    },
    systemCode: String,
    location: {
      latitude: Number,
      longitude: Number,
      state: String,
      country: { type: String, default: 'Nigeria' },
    },
    kyc: {
      meansOfIdentification: String,
      identificationNumber: String,
      identificationImage: {
        url: String,
        publicId: String,
      },
    },
    ...auditableFields,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        delete ret.passwordResetToken;
        delete ret.passwordResetTokenExpiresAt;
        delete ret.__v;
        delete ret.password;
        delete ret.emailVerificationTokenExpiry;
        return ret;
      },
    },
  },
);

// add plugin that converts mongoose to json
DoctorSchema.plugin(toJSON);
DoctorSchema.plugin(paginate);

/**
 * @typedef Doctor
 */
const Doctor: Pagination<Doctor> = model<Doctor, Pagination<Doctor>>(
  'Doctor',
  DoctorSchema,
);

export default Doctor;
