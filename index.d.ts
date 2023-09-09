/* eslint-disable @typescript-eslint/no-explicit-any */
import { Moment } from 'moment';
import {
  GENDER,
  PORTFOLIO,
  ACCOUNT_STATUS,
  RIDE_TYPE,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS,
  PAYMENT_SOURCE,
  NOTIFICATION_TYPES,
  RIDE_HAILING_STATUS,
  SUBSCRIPTION_TYPE,
  USER_GROUP_SUBSCRIPTION_STATUS,
  CARD_TYPES,
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

interface Agent extends AuditableFields {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  residentialAddress: string;
  verifiedAt: Date;
  verificationToken: string;
  verificationTokenExpiry: Date;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;
  pushNotificationId: string;
  allowPushNotification: boolean;
  agentAppVersion: string;
  gender: GENDER;
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
  accountStatus: {
    status: ACCOUNT_STATUS;
    reason: string;
    updatedBy: string;
    updatedAt: Date;
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
interface User extends AuditableFields {
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
  userAppVersion?: string;
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

interface AuditableFields {
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  createdBy?: User | string;
  updatedBy?: User | string;
  deletedBy?: User | string;
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

interface BaseResponse {
  error: boolean;
  status: string;
  message: string;
  Message: string;
}

export interface CardTokenInterface {
  id: string;
  _id: string;
  user: User | string;
  tokenizedCard: string;
  customerPaymentId: string;
  source: string;
}

interface CreatePaymentLinkResponseInterface extends BaseResponse {
  data: {
    link: string;
  };
}

interface GeneratePaymentLinkInterface {
  customer: {
    email: string;
    name: string;
    phonenumber?: string;
  };
  meta: Map;
  amount: number;
  currency: CURRENCIES;
  tx_ref: string;
  customizations: {
    title: string;
    logo: string;
  };
  redirect_url: string;
}

interface FlutterwavePaymentLinkInterface {
  error: boolean;
  status: string;
  error: { field: string; message: string }[];
  message: string;
  data: {
    link: string;
  };
}

interface FlutterwaveTransactionLog extends AuditableFields {
  id: string;
  _id: string;
  user: User | string;
  status: FLUTTERWAVE_TRANSACTION_STATUS;
  amount: number;
  currency: CURRENCIES;
  tx_ref: string;
}

interface RegulateTransaction {
  id: string;
  idempotentKey: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

interface VerifyTransactionVerifyResponse extends BaseResponse {
  [key: string]: any;
}

interface VerifyTransaction {
  transactionId?: string;
  txRef?: string;
  verifyBy?: string;
}

interface TransactionLog extends AuditableFields {
  id: string;
  user: User | string;
  Doctor: Doctor | string;
  for: PORTFOLIO;
  amount: number;
  balanceAfterTransaction: number;
  transactionDump: TransactionDump | string | null;
  type: TRANSACTION_TYPES;
  category: string | null;
  source: TRANSACTION_SOURCES;
  reference: string | null;
  purpose: string | null;
  meta: object | null;
  pending: boolean | null;
  status: TRANSACTION_STATUS;
  locked: boolean | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  fees: number | null;
}

interface TransactionDump extends AuditableFields {
  id: string;
  data: object;
  user: User | string;
  Doctor: Doctor | string;
  type: TRANSACTION_DUMP_TYPES;
}

interface Wallet extends AuditableFields {
  user: User | string;
  Doctor: Doctor | string;
  walletFor: PORTFOLIO;
  id: string;
  walletNumber: string;
  transactionPin: string;
  walletName: string;
  bankName: string;
  availableBalance: number;
  balance: {
    available: number;
    ledger: number;
  };
  walletNumber: string;
  locked: boolean;
  walletName: string;
  bankName: string;
  bankReferenceNumber: string;
  walletReference: string;
  stash: string;
  callbackUrl: string;
  __v: number;
  systemCode: string;
}

interface CardToken {
  id?: string;
  _id?: string;
  user: User | string;
  tokenizedCard: string;
  source: PAYMENT_SOURCE;
  expiry: string;
  cardBrand: CARD_BRANDS;
  country: string;
  first6Digits: string;
  last4Digits: string;
  cardType: CARD_TYPES;
}

interface TokenChargeCardRequest {
  token: string;
  currency: string;
  country?: string | undefined;
  amount: number;
  email: string;
  first_name?: string | undefined;
  last_name?: string | undefined;
  IP?: string | undefined;
  narration?: string | undefined;
  tx_ref: string;
  meta?: string | undefined;
  device_fingerprint?: string | undefined;
  payment_plan?: string | undefined;
  subaccounts?: [] | undefined;
}

interface TokenChargeCardResponse extends BaseResponse {
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    cycle: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    merchant_bears_fee: number;
    charge_code: string;
    charge_message: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    acct_message: any;
    payment_type: string;
    charge_type: string;
    created_at: string;
    amount_settled_for_this_transaction: number;
    customer: {
      id: number;
      phone_number: string | null;
      name: string;
      email: string;
      created_at: string;
    };
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
      token: string;
    };
  };
}

interface PagaBaseResponse {
  error: boolean;
  responseCode?: string;
  statusCode?: string;
}
interface GetBanksType extends PagaBaseResponse {
  error: boolean;
  responseCategoryCode: null;
  message: string;
  referenceNumber: string;
  banks: Bank[];
}

interface RegisterPersistentPaymentAccount {
  referenceNumber: string;
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  accountName: string;
  financialIdentificationNumber?: string;
  accountReference: string;
  creditBankId?: string | null;
  creditBankAccountNumber?: string | null;
  callbackUrl: string | null;
  user?: string | null;
  currency: string;
}

interface PagaResponse extends PagaBaseResponse {
  [key: string]: string;
}

interface Bank extends AuditableFields {
  id: string;
  bankName: string;
  bankCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface InAppTransfer {
  narration: string;
  amount: number;
  idempotentKey: string;
  walletNumber: string;
  purpose: string;
}

interface health-aidEarnings extends AuditableFields {
  id: string;
  user: User | string;
  Doctor: Doctor | string;
  for: PORTFOLIO;
  amount: number;
  charge: number;
  source: string;
  profit: number;
  amountSpent: number;
  transaction: TransactionLogInterface | string | null;
  earningsIn: 'kuda' | 'flutterwave' | 'paga';
}

interface Notification {
  id: string;
  user: User | string;
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

export interface Ride extends AuditableFields {
  id: string;
  _id: string;
  user: User | string;
  Doctor?: Doctor | string;
  type: RIDE_TYPE;
  pickupAddress: string;
  destinationAddress: string[];
  status: RIDE_HAILING_STATUS;
  paymentStatus: RIDE_PAYMENT_STATUS;
  amount: {
    currency: CURRENCIES;
    cost: number;
  };
  pickup: {
    location: string;
    coordinates: { latitude: number; longitude: number };
    user?: string;
  };
  destination: {
    distance: number;
    duration: number;
    location: string;
    coordinates: { latitude: number; longitude: number };
  }[];
  groupPickup: {
    user?: string;
    location: string;
    coordinates: { latitude: number; longitude: number };
  }[];
  groupDestination: {
    distance: number;
    duration: number;
    user: User | string;
    location: string;
    coordinates: { latitude: number; longitude: number };
  }[];
  pickupTime: Date;
  toAndFro?: boolean;
  trips?: Map<string, Trip[]>;
  numberOfTrips?: number;
  // pickupTime: {
  //   firstPickUp: {
  //     pickedUp: boolean;
  //     pickupTime: Date;
  //   };
  //   secondPickUp?: {
  //     pickedUp?: boolean;
  //     pickupTime?: Date;
  //   };
  // }[];
}

interface Trip {
  name: string;
  status: RIDE_HAILING_STATUS;
  tripDate?: Date;
  completedAt?: Moment;
}

interface SubscriptionPlans {
  weekly: {
    [key: string]: number;
  };
  weekends: {
    [key: string]: number;
  };
  weekdays: {
    [key: string]: number;
  };
  monthly: {
    [key: string]: number;
  };
}

interface ChargeInfo {
  type?: 'individual' | 'group';
  tokenizedCard?: string;
}

export interface Subscription extends AuditableFields {
  id?: string;
  _id?: string;
  name: string;
  toAndFro: boolean;
  user: User | string;
  members?: {
    user: User | string;
    status: { status: USER_GROUP_SUBSCRIPTION_STATUS; reason: string };
  }[];
  status: SUBSCRIPTION_STATUS | string;
  type: SUBSCRIPTION_TYPE;
  retries: number;
  amount: {
    currency: CURRENCIES;
    cost: number;
  };
  plan: SUBSCRIPTION_PLANS;
  pickupDays: string[];
  cycle: {
    startDate: Date;
    endDate: Date;
  };
  cycleId: string;
  paymentInfo: Map;
  ride: Ride | string;
  Doctor: User | string;
  meta: {
    numberOfRideDays?: number;
    numberOfCompletedRideDays?: number;
    amountDueForDoctor?: number;
    amountWithdrawnByDoctor?: number;
  };
}

interface KudaBaseUrls {
  PRODUCTION: string;
  SANDBOX: string;
}
interface KudaEndpoints {
  GET_ACCOUNT_TOKEN: string;
}

interface GenerateVirtualAccountRequest {
  Data: {
    user?: string;
    Doctor?: string;
    walletFor?: 'user' | 'Doctor';
    trackingReference: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    accountName: string;
    systemCode: string;
  };
  RequestRef: string;
  // financialIdentificationNumber: string;
  // callbackUrl: string | null;
  ServiceType: string;
}

interface GetVirtualAccountRequest {
  serviceType: string;
  requestref: string;
  data: {
    trackingReference: string;
    PageSize: string;
    PageNumber: string;
  };
}

interface GetVirtualAccountResponse extends BaseResponse {
  status: string;
  data:
    | {
        [key: string]: string | boolean;
      }[]
    | { [key: string]: string | boolean };
}

interface GenerateVirtualAccountResponse extends BaseResponse {
  status: string;
  message: string;
  data: {
    accountNumber: string;
  };
}

interface GetBankListRequest {
  servicetype: string;
  requestref: string;
}

interface GetBankListResponse extends BaseResponse {
  data: {
    banks: {
      bankCode: string;
      bankName: string;
    }[];
  };
}

interface ValidateAccountInfoRequest {
  servicetype: string;
  requestref: string;
  Data: {
    beneficiaryAccountNumber: string;
    beneficiaryBankCode: string;
    SenderTrackingReference: string;
    isRequestFromVirtualAccount: string;
  };
}

interface ValidateAccountInfoResponse extends BaseResponse {
  data: {
    beneficiaryAccountNumber: string;
    beneficiaryName: string;
    senderAccountNumber: null;
    senderName: null;
    beneficiaryCustomerID: number;
    beneficiaryBankCode: string;
    nameEnquiryID: number;
    responseCode: null;
    transferCharge: number;
    sessionID: 'NA';
  };
}

interface WithdrawRequest {
  servicetype: string;
  requestref: string;
  Data: {
    trackingReference?: string;
    beneficiaryAccount?: string;
    amount?: number;
    narration?: string;
    beneficiaryBankCode?: string;
    beneficiaryName?: string;
    senderName?: string;
    nameEnquiryId?: string;
    ClientFeeCharge?: number;
  };
}

interface WithdrawResponse extends BaseResponse {
  requestReference: string;
  transactionReference: string;
  responseCode: string;
  status: string;
  message: string;
  data: null;
}

interface InitiateInAppPayment extends TransactionLog {
  walletNumber: string;
  idempotentKey: string;
  narration: string;
}

interface SubscriptionRequestDto extends Subscription, Ride {
  destination: {
    distance: number;
    duration: number;
    location: string;
    user: string;
    coordinates: { latitude: number; longitude: number };
  }[];
  firstTripTime: string;
  secondTripTime: string;
  startDate: Date | Moment | string;
  endDate: Date | Moment | string;
  members: string[];
}

export type IndividualSubResponse = {
  status: string;
  isUsingPaymentLink: boolean;
  message: string;
  type: SUBSCRIPTION_TYPE;
  selectedDoctors: Doctor[];
};
