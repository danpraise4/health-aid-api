/* eslint-disable @typescript-eslint/no-explicit-any */
import PaystackUtilFunction from './paystack.util';

export default class PaystackSdk extends PaystackUtilFunction {
  constructor(build: { apiKey: string }) {
    super(build);
  }

  async createCustomer(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  }) {
    const response = await this.postRequest<any, any>(
      this.buildHeader(),
      data,
      `${this.getBaseUrl()}/customer`,
    );
    return this.checkError(response);
  }

  async getCustomerDetails(identifier: string) {
    const response = await this.getRequest<any>(
      this.buildHeader(),
      `${this.getBaseUrl()}/customer/${identifier}`,
    );
    return this.checkError(response);
  }

  async createDVA(data: { preferred_bank: string; customer: string }) {
    const response = await this.postRequest<any, any>(
      this.buildHeader(),
      data,
      `${this.getBaseUrl()}/dedicated_account`,
    );
    return this.checkError(response);
  }

  async verifyBankAccount(data: { account_number: string; bank_code: string }) {
    const response = await this.getRequest<any>(
      this.buildHeader(),
      `${this.getBaseUrl()}/bank/resolve?account_number=${
        data.account_number
      }&bank_code=${data.bank_code}`,
    );
    return this.checkError(response);
  }

  async getBanks() {
    const response = await this.getRequest<any>(
      this.buildHeader(),
      `${this.getBaseUrl()}/bank`,
    );
    return this.checkError(response);
  }

  async charge(data: {
    amount: number;
    email: string;
    reference?: string;
    authorization_code?: string;
    metadata?: string;
  }) {
    const body = this.filterOptionalFields(data);
    const response = await this.postRequest<any, any>(
      this.buildHeader(),
      body,
      `${this.getBaseUrl()}/charge_authorization`,
    );
    return this.checkError(response);
  }

  async initialize(data: {
    amount: number;
    email: string;
    reference?: string;
    callback_url?: string;
    metadata?: string;
  }) {
    const body = this.filterOptionalFields(data);
    const response = await this.postRequest<any, any>(
      this.buildHeader(),
      { ...body, channels: ['card'] },
      `${this.getBaseUrl()}/transaction/initialize`,
    );
    return this.checkError(response);
  }

  async verifyTransaction(reference: string) {
    const response = await this.getRequest<any>(
      this.buildHeader(),
      `${this.getBaseUrl()}/transaction/verify/${reference}`,
    );
    return this.checkError(response);
  }
}
