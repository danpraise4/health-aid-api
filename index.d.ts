/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GENDER,
  PORTFOLIO,
  ACCOUNT_STATUS,
  NOTIFICATION_TYPES,
} from './config/constants';
interface PaginationOptions {
  populate?: string;
  select?: string;
  orderBy?: string;
  limit?: string;
  page?: string;
}

interface Waitlist extends AuditableFields {
  id: string;
  _id: string;
  email: string;
}

interface PaginationModel<T> {
  totalData: number | undefined;
  limit: number | undefined;
  totalPages: number | undefined;
  page: number | undefined;
  data: T[];
}
interface Patient extends AuditableFields {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  portfolio: PORTFOLIO;
  residentialAddress: string;
  verifiedAt: Date;
  verificationToken: string;
  verificationTokenExpiry: Date;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;
  pushNotificationId: string;
  allowPushNotification: boolean;
  appVersion?: string;
  gender: GENDER;
  otpLogin: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  avatar: {
    url: string;
    publicId: string;
  };
  systemCode: string;
  dob: Date;
  deviceInfo: typeof Map;
  referralCode: string;
  inviteCode: string;
  accountStatus: {
    status: ACCOUNT_STATUS;
    reason: string;
  };
  location: {
    latitude: number;
    longitude: number;
    state?: string;
    country?: string;
  };
  subscription?: Subscription | string;
  kyc: {
    meansOfIdentification: string;
    identificationNumber: string;
    identificationImage: {
      url: string;
      publicId: string;
    };
  };
}
interface Doctor extends AuditableFields {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  portfolio: PORTFOLIO;
  residentialAddress: string;
  verifiedAt: Date;
  verificationToken: string;
  verificationTokenExpiry: Date;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;
  pushNotificationId: string;
  allowPushNotification: boolean;
  DoctorAppVersion?: string;
  gender: GENDER;
  systemCode: string;
  otpLogin: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  avatar: {
    url: string;
    publicId: string;
  };
  dob: Date;
  deviceInfo: typeof Map;
  referralCode: string;
  inviteCode: string;
  accountStatus: {
    status: ACCOUNT_STATUS;
    reason: string;
  };
  meta?: {
    isDoctorAvailableForRide?: boolean;
    isDoctorAvailableForRideSubscription?: boolean;
    lastLogin?: Date;
    bankName?: string;
    accountNumber?: string;
    DoctorLicenseNumber?: string;
    carBrand?: string;
    carModel?: string;
    carColor?: string;
    carPlateNumber?: string;
  };
  isDoctorAvailableForRide?: boolean;
  lastLogin?: Date;
  bankName?: string;
  accountNumber?: string;
  DoctorLicenseNumber?: string;
  carBrand?: string;
  carModel?: string;
  carColor?: string;
  carPlateNumber?: string;
  location: {
    latitude: number;
    longitude: number;
    state?: string;
    country?: string;
  };
  kyc: {
    meansOfIdentification: string;
    identificationNumber: string;
    identificationImage: {
      url: string;
      publicId: string;
    };
  };
}

export interface Admin extends AuditableFields {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerifiedAt: Date;
  emailVerificationToken: string;
  emailVerificationTokenExpiry: Date;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;
  accountStatus: {
    status: ACCOUNT_STATUS;
    reason: string;
    updatedBy: Admin | string;
    updatedAt: Date;
  };
  role: ADMIN_ROLE;
  phoneNumber: string;
  rssn: string;
  avatar: {
    url: string;
    publicId: string;
  };
  gender: GENDER;
}

interface AuditableFields {
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  createdBy?: Patient | Doctor | string;
  updatedBy?: Patient | Doctor | string;
  deletedBy?: Patient | Doctor | string;
}

export type ErrorTracker = {
  id: string;
  stackTrace: Map;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

type ObjT = {
  [key: string]: any;
};

interface Notification {
  id: string;
  Patient: Patient | string;
  Doctor: Doctor | string;
  title: string;
  meta: Map;
  message: string;
  read: boolean;
  for: PORTFOLIO;
  type: NOTIFICATION_TYPES;
  priority: number;
}

export interface SendChampConstructor {
  publicKey: string;
  mode?: 'test' | 'live' | 'local-simulator';
}

export interface SendChampEndpoints {
  SEND_SMS: string;
  SEND_VOICE: string;
  getReport: (sms_message_id: string) => string;
  REGISTER_SENDER: string;
  SEND_VERIFICATION_OTP: string;
  VERIFY_VERIFICATION_OTP: string;
  SEND_WHATSAPP: string;
}

export type SendChampBaseUrls = {
  [x: string]: string;
};

export interface SendSMSConfig {
  route?: 'non_dnd' | 'dnd' | 'international';
  to: string | Array<string>;
  message: string;
  sender_name: string;
}

export interface SendOtpConfig {
  channel: 'sms' | 'email';
  sender: string;
  token_type: 'numeric' | 'alphanumeric';
  token_length: number;
  expiration_time: number; // In minutes
  customer_email_address?: string;
  customer_mobile_number?: string;
  meta_data?: Record<string | number, unknown>;
}

export interface VerifyOtpConfig {
  verification_reference: string;
  verification_code: string;
}

export interface RegisterSenderConfig {
  name: string;
  use_case: 'transactional' | 'marketing' | 'transaction_marketing';
  sample: string;
}

export interface SendWHATSAPPTemplateConfig {
  sender: string;
  recipient: string;
  template_code: string;
  meta_data: { [x: string]: string };
}

export interface SendWHATSAPPTextConfig {
  recipient: string;
  sender: string;
  message: string;
}

export interface SendWHATSAPPVideoConfig {
  recipient: string;
  sender: string;
  link: string;
}

export interface SendWHATSAPPAudioConfig {
  recipient: string;
  sender: string;
  link: string;
  message: string;
}

export interface SendWHATSAPPLocationConfig {
  recipient: string;
  sender: string;
  longitude: number;
  latitude: number;
  name: string;
  address: string;
}

export interface SendSMSResponse {
  message: string;
  code: string;
  status: 'success' | 'error';
  data: SMSResponseData;
}

export interface SendVOICEResponse {
  message: string;
  code: string;
  data: VOICEResponseData;
  status: 'success' | 'error';
}

export interface SendOtpResponse {
  message: string;
  code: string;
  status: 'success' | 'error';
  data: SendOtpResponseData;
}

export interface VerifyOtpResponse {
  message: string;
  code: string;
  status: 'success' | 'error';
  data: VerifyOtpResponseData;
}

export interface SendWHATSAPPResponse {
  message: string;
  code: string;
  status: 'success' | 'error';
  data: SendWhatsappResponseData;
}

interface SendWhatsappResponseData {
  provider_reference: string;
  provider_message: string;
  provider_status: string;
}

interface SMSResponseData {
  status: string;
  business: string;
  id: string;
  uid?: string;
  business_uid?: string;
  name?: string;
  phone_number?: string;
  amount: string;
  reference: string;
  message_references?: Array<string>;
  delivered_at?: string;
  sent_at?: string;
}

interface VOICEResponseData {
  phone_number: string;
  id: string;
  status: string;
  reference: string;
}

interface SendOtpResponseData {
  business_uid: string;
  reference: string;
  channel: {
    id: number;
    name: string;
    is_active: boolean;
  };
  token?: string;
  status: string;
}

interface VerifyOtpResponseData {
  id: string;
  business_id: string;
  business_customer_id: string;
  channel_id: string;
  verification_code: string;
  delivery_status: string;
  verification_status: string;
  expires_at: string;
  verification_time: string;
  created_at: string;
  updated_at: string;
  verification_reference: string;
  meta_data: unknown;
}
