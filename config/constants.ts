export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ACCOUNT_STATUS {
  INVITATION_SENT = 'invitation_sent',
  CONFIRMED = 'confirmed',
  DEACTIVATED = 'deactivated',
  COMPROMISED = 'compromised',
  PENDING = 'pending',
}

export enum PORTFOLIO {
  USER = 'user',
  Doctor = 'Doctor',
}

export enum PAYMENT_SOURCE {
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
  STRIPE = 'stripe',
}

export enum FLUTTERWAVE_TRANSACTION_STATUS {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PENDING = 'pending',
}

export enum TRANSACTION_TYPES {
  CREDIT = 'credit',
  DEBIT = 'debit',
  LOAN = 'loan',
  REFUND = 'refund',
}

export enum TRANSACTION_SOURCES {
  BANK_TRANSFER = 'bank_transfer',
  CARD_DEPOSIT = 'card_deposit',
  PAYMENT_LINK = 'payment_link',
  AVAILABLE_BALANCE = 'available_balance',
  LEDGER_BALANCE = 'ledger_balance',
  RESERVED_BALANCE = 'reserved_balance',
  STASH = 'stash',
  REVERSAL = 'reversal',
  SUBSCRIPTION = 'subscription',
  USER_TRANSFER = 'user_transfer',
  REFERRAL_BONUS = 'referral_bonus',
}

export enum TRANSACTION_STATUS {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export enum STATUS {
  ACTIVE = 'active',
  FAILED = 'failed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  DEACTIVATED = 'deactivated',
  DENIED = 'denied',
}

export enum IMAGE_CLOUD_PROVIDERS {
  CLOUDINARY = 'cloudinary',
}

export enum CARD_BRANDS {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  VERVE = 'verve',
}

export enum CARD_TYPES {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum TRANSACTION_DUMP_TYPES {
  SUBSCRIPTION = 'subscription',
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
  REFUND = 'refund',
  DISPUTE = 'dispute',
  WITHDRAWAL = 'withdrawal',
  REFERRAL_BONUS = 'referral_bonus',
}

export enum PAGA_BANK_ENDPOINT {
  BANKS = 'banks',
  GET_BANKS = 'getBanks',
  PAYMENT_REQUEST = 'paymentRequest',
  STATUS = 'status',
  HISTORY = 'history',
  UPDATE_PERSISTENT_PAYMENT_ACCOUNT = 'updatePersistentPaymentAccount',
  DELETE_PERSISTENT_PAYMENT_ACCOUNT = 'deletePersistentPaymentAccount',
  REGISTER_PERSISTENT_PAYMENT_ACCOUNT = 'registerPersistentPaymentAccount',
  REFUND = 'refund',
  GET_PERSISTENT_PAYMENT_ACCOUNT = 'getPersistentPaymentAccount',
  GET_MOBILE_OPERATORS = 'getMobileOperators',
}

export enum CURRENCIES {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
}

export enum CARD_TYPES {
  SAVED_CARD = 'savedCard',
  NEW_CARD = 'newCard',
}

export enum RIDE_HAILING_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  ARRIVED = 'arrived',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RIDE_TYPE {
  HIRE = 'hire',
  GROUP_SUBSCRIPTION = 'group_subscription',
  INDIVIDUAL_SUBSCRIPTION = 'individual_subscription',
}

export enum SUBSCRIPTION_PLANS {
  weekly = 'weekly',
  weekends = 'weekends',
  weekdays = 'weekdays',
  monthly = 'monthly',
}

export enum USER_GROUP_SUBSCRIPTION_STATUS {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum SUBSCRIPTION_STATUS {
  ACTIVE = 'active',
  FAILED = 'failed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum SUBSCRIPTION_TYPE {
  GROUP = 'group',
  INDIVIDUAL = 'individual',
}

export enum PAID_WITH {
  CARD = 'card',
  WALLET = 'wallet',
}

export enum NOTIFICATION_TYPES {
  RIDE_REQUEST = 'ride_request',
  RIDE_ACCEPTED = 'ride_accepted',
  RIDE_STARTED = 'ride_started',
  RIDE_COMPLETED = 'ride_completed',
  RIDE_CANCELLED = 'ride_cancelled',
  RIDE_ARRIVED = 'ride_arrived',
  RIDE_HAILING = 'ride_hailing',
  RIDE_HAILING_CANCELLED = 'ride_hailing_cancelled',
  RIDE_HAILING_ACCEPTED = 'ride_hailing_accepted',
  RIDE_HAILING_STARTED = 'ride_hailing_started',
  RIDE_HAILING_ARRIVED = 'ride_hailing_arrived',
  RIDE_HAILING_COMPLETED = 'ride_hailing_completed',
  TRANSACTION_NOTIFICATION = 'transaction_notification',
  RIDE_REMINDER = 'ride_reminder',
  SUBSCRIPTION_REMINDER = 'subscription_reminder',
  GROUP_SUBSCRIPTION_REQUEST = 'group_subscription_request',
  GROUP_SUBSCRIPTION_ACCEPTED = 'group_subscription_accepted',
}

export enum ADMIN_ROLE {
  SUPER_ADMIN = 'super_admin',
  SUB_ADMIN = 'sub_admin',
  TRANSACTION = 'transaction',
  ENGINEER = 'engineer',
  FINANCE = 'finance',
  SUPPORT = 'support',
}

export enum WS_EVENT {
  CONNECTION = 'connection',
  CONNECTED = 'connected',
  DISCONNECT = 'disconnect',
  REQUEST_ERROR = 'request_error',
  RIDE_REQUEST = 'ride_request',
  RIDE_ACCEPTED = 'ride_accepted',
  RIDE_HAILING_ACCEPTED = 'ride_hailing_accepted',
  RIDE_HAILING_STARTED = 'ride_hailing_started',
  INITIATE_CARD_PAYMENT = 'initiate_card_payment',
  INITIATE_RIDE_SUBSCRIPTION_REQUEST = 'initiate_ride_subscription_request',
  INITIATE_RIDE_SUBSCRIPTION_RESPONSE = 'initiate_ride_subscription_response',
  INITIATE_RIDE_HIRE_REQUEST = 'initiate_ride_hire_request',
  UPDATE_Doctor_LOCATION = 'update_Doctor_location',
  UPDATE_USER_LOCATION = 'update_user_location',
  JOIN_ROOM = 'join_room',
  SEND_LIVE_LOCATION = 'send_live_location',
  RECEIVE_LIVE_LOCATION = 'receive_live_location',
  ACCEPT_RIDE_HIRE_REQUEST = 'accept_ride_hire_request',
  ACCEPT_RIDE_SUBSCRIPTION_REQUEST = 'accept_ride_subscription_request',
  GET_NEARBY_DoctorS = 'get_nearby_Doctors',
  IN_APP_TRANSFER_REQUEST = 'in_app_transfer_request',
  IN_APP_TRANSFER_RESPONSE = 'in_app_transfer_response',
  GET_USER_WALLET_BY_SYSTEM_CODE = 'get_user_wallet_by_system_code',
  GET_USER_BALANCE = 'get_user_balance',
}

export enum MIXPANEL_EVENTS {
  LOGIN = 'User Logged In',
  SIGNUP = 'User Signed Up',
  VERIFY_ACCOUNT = 'User Verified Account',
  RIDE_REQUEST = 'User requested ride',
  Doctor_ACCEPTED_RIDE_REQUEST = 'Doctor accepted ride request',
  Doctor_CANCELLED_RIDE = 'Doctor cancelled ride',
  Doctor_COMPLETED_RIDE = 'Doctor completed ride',
  WITHDRAW = 'User Withdraws money',
  INITIATE_CARD_PAYMENT = 'User initiates card payment',
  IN_APP_PAYMENT = 'User makes in-app payment',
  DEDICATED_WALLET_CREATED = 'User creates dedicated wallet',
  CREATE_GROUP_RIDE_SUBSCRIPTION = 'User creates group ride subscription',
  CREATE_INDIVIDUAL_RIDE_SUBSCRIPTION = 'User creates individual ride subscription',
  JOIN_GROUP_RIDE_SUBSCRIPTION = 'User joins group ride subscription',
  INITIATE_RIDE_HIRE_REQUEST = 'User initiates ride hire request',
  ACCEPT_RIDE_HIRE_REQUEST = 'Doctor accepts ride hire request',
  ADDED_TO_GROUP_RIDE_SUBSCRIPTION = 'User added to group ride subscription',
  INITIATE_CARD_PAYMENT_FOR_RIDE_SUBSCRIPTION = 'User initiates card payment for ride subscription',
  ACCEPT_RIDE_SUBSCRIPTION_REQUEST = 'Doctor accepts ride subscription request',
}
