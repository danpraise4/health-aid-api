/* eslint-disable @typescript-eslint/ban-ts-comment */
import Patient from '../database/models/patient.model';
import mongoose from 'mongoose';
import BaseService from './base.service';

export default class PatientService extends BaseService {
  constructor() {
    super();
  }

  async createPatient(PatientBody: Partial<Patient>): Promise<Patient> {
    const patient = await Patient.create(PatientBody);
    return patient;
  }
  async getAllPatients(
    filter: Partial<Patient>,
    options: {
      orderBy?: string;
      page?: string;
      limit?: string;
      populate?: string;
    } = {},
    ignorePagination = false,
  ) {
    const patient = ignorePagination
      ? await Patient.find(filter)
      : await Patient.paginate(filter, options);
    return patient;
  }

  async getPatientById(
    id: string,
    eagerLoad = true,
    load?: string,
  ): Promise<mongoose.Document & Patient> {
    const data = eagerLoad
      ? await Patient.findById(id).populate(load)
      : Patient.findById(id);
    if (!data) new Error(`Patient with id: ${id} does not exist`);
    return data;
  }

  async updatePatientById(
    id: string,
    updateBody: Partial<Patient>,
  ): Promise<Patient> {
    const Patient = await this.getPatientById(id);
    if (!Patient) {
      throw new Error(`Oops!, Patient does not exist`);
    }
    Object.assign(Patient, updateBody);
    await Patient.save();
    return Patient;
  }

  async deletePatientById(id: string): Promise<Patient> {
    const data = await Patient.findByIdAndDelete(id);
    return data;
  }

  async getPatientByEmail(email: string): Promise<Patient> {
    const data = await Patient.findOne({ email });
    return data;
  }

  async getPatientByPhoneNumber(phoneNumber: string): Promise<Patient> {
    const data = await Patient.findOne({ phoneNumber });
    return data;
  }

  async getPatientByReferralCode(referralCode: string): Promise<Patient> {
    const data = await Patient.findOne({ referralCode });
    return data;
  }

  async getPatientDetail(filter: Partial<Patient>) {
    const data = await Patient.findOne(filter);
    return data;
  }

  async searchPatients(filter: Partial<Patient>): Promise<Patient[]> {
    const data = await Patient.find(filter);
    return data;
  }

  async savePatientDeviceInfo(data: typeof Map, actor: Patient) {
    const patient = await Patient.findByIdAndUpdate(
      actor.id,
      {
        $push: {
          'settings.deviceInfo': data,
        },
      },
      { new: true },
    );
    return patient;
  }

  async PatientsCount(filter: Partial<Patient>): Promise<number> {
    const data = await Patient.countDocuments(filter);
    return data;
  }
}
