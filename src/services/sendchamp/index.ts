import axios, { AxiosInstance } from 'axios';
import SMS from './sms';
import VERIFICATION from './otp';
import { SendChampConstructor } from '../../../index.d';
import { baseUrl } from './endpoints';

export default class SendChamp {
  private axiosInstance: AxiosInstance;
  public SMS: SMS = new SMS();
  public VERIFICATION: VERIFICATION = new VERIFICATION();

  constructor(config: SendChampConstructor) {
    const { publicKey, mode } = config;
    this.axiosInstance = axios.create({
      baseURL: baseUrl[mode || 'LIVE'],
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Initialize axios instance of subclasses
    SMS.axiosInstance = this.axiosInstance;
    VERIFICATION.axiosInstance = this.axiosInstance;
  }
}
