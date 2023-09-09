/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import AppException from '../../exceptions/AppException';
import { RequestType } from '../middlewares/auth.middleware';
import pick from '../../utils/pick';
import HelperClass from '../../utils/helper';
import { UploadApiResponse } from 'cloudinary';
import PatientService from '../../services/patient.service';
import NotificationService from '../../services/notification.service';
import { deleteFile, uploadBase64File } from '../../services/file.service';
import Doctor from '../../database/models/healthworker.model';
import { PORTFOLIO } from '../../../config/constants';
import Patient from '../../database/models/patient.model';

export default class PatientController {
  constructor(private readonly PatientService: PatientService) {}
  async getAllPatients(req: RequestType, res: Response, next: NextFunction) {
    try {
      const options = pick(req.query, ['limit', 'page', 'populate', 'orderBy']);
      const filter = pick(req.query, ['accountStatus', 'portfolio']);
      if (req.query.search) {
        Object.assign(filter, {
          $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        });
      }
      req.query.state
        ? Object.assign(filter, { 'votingAddress.state': req.query.state })
        : delete req.query.state;
      req.query.lga
        ? Object.assign(filter, { 'votingAddress.lga': req.query.lga })
        : delete req.query.lga;
      req.query.ward
        ? Object.assign(filter, { 'votingAddress.ward': req.query.ward })
        : delete req.query.ward;
      req.query.pollingUnit
        ? Object.assign(filter, {
            'votingAddress.pollingUnit': req.query.pollingUnit,
          })
        : delete req.query.pollingUnit;
      req.query.senatorialDistrict
        ? Object.assign(filter, {
            senatorialDistrict: req.query.senatorialDistrict,
          })
        : delete req.query.senatorialDistrict;
      req.query.zone
        ? Object.assign(filter, {
            federalConstituency: req.query.zone,
          })
        : delete req.query.zone;

      const Patients = await this.PatientService.getAllPatients(
        filter,
        options,
      );
      return res.status(httpStatus.OK).json({
        status: 'success',
        Patients,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async getMyProfile(req: RequestType, res: Response, next: NextFunction) {
    try {
      let me = await this.PatientService.getPatientById(req.Patient.id, true);
      if (!me) {
        me = await this.PatientService.getOne(Doctor, {
          _id: req.Patient.id,
        });
        if (!me) throw new Error('Patient not found');
      }

      return res.status(httpStatus.OK).json({
        status: 'success',
        me,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async updateMyProfile(req: RequestType, res: Response, next: NextFunction) {
    try {
      if (req.body.avatar) {
        if (req.Patient.avatar) {
          await deleteFile(req.Patient.avatar.publicId);
        }
        const { secure_url, public_id } = (await uploadBase64File(
          req.body.avatar,
          'Patient_avatar',
          HelperClass.generateRandomChar(9),
        )) as UploadApiResponse;
        req.body.avatar = { url: secure_url, publicId: public_id };
      }
      let me;
      req.Patient.portfolio === PORTFOLIO.PATIENT
        ? (me = await this.PatientService.updatePatientById(
            req.Patient.id,
            req.body,
          ))
        : (me = await this.PatientService.update(
            Doctor,
            { _id: req.Patient.id },
            req.body,
          ));
      return res.status(httpStatus.OK).json({
        status: 'success',
        me,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async uploadAvatar(req: RequestType, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const { secure_url, public_id } = await uploadBase64File(
        file.path,
        'Patient_avatar',
        HelperClass.generateRandomChar(9),
      );
      let me;
      req.Patient.portfolio === PORTFOLIO.PATIENT
        ? (me = await this.PatientService.updatePatientById(req.Patient.id, {
            avatar: { url: secure_url, publicId: public_id },
          }))
        : (me = await this.PatientService.update(
            Doctor,
            { _id: req.Patient.id },
            {
              avatar: { url: secure_url, publicId: public_id },
            },
          ));
      return res.status(httpStatus.OK).json({
        status: 'success',
        me,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException) {
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
      }
    }
  }

  async getPatientProfile(req: RequestType, res: Response, next: NextFunction) {
    try {
      let patient = await this.PatientService.getOne(Patient, {
        _id: req.params.Patient,
      });
      if (!patient) {
        patient = await this.PatientService.getOne(Doctor, {
          _id: req.params.Patient,
        });
        if (!patient) throw new Error('Patient not found');
      }
      return res.status(httpStatus.OK).json({
        status: 'success',
        patient,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException) {
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
      }
    }
  }

  async searchPatients(req: RequestType, res: Response, next: NextFunction) {
    try {
      const filter = {};
      Object.assign(filter, {
        $or: [
          { firstName: { $regex: req.query.q, $options: 'i' } },
          { lastName: { $regex: req.query.q, $options: 'i' } },
          { systemCode: { $regex: req.query.q, $options: 'i' } },
        ],
      });
      const Patient = await this.PatientService.searchPatients(filter);
      return res.status(httpStatus.OK).json({
        status: 'success',
        Patient,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async savePatientDeviceInfo(
    req: RequestType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await this.PatientService.savePatientDeviceInfo(
        req.body,
        req.Patient,
      );
      return res.status(httpStatus.OK).json({
        status: 'success',
        data,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async getNotifications(req: RequestType, res: Response, next: NextFunction) {
    try {
      const filter = pick(req.query, ['Patient']);
      const options = pick(req.query, ['limit', 'page', 'populate', 'orderBy']);
      const data = await NotificationService.getAllNotifications(
        filter,
        options,
      );
      return res.status(httpStatus.OK).json({
        status: 'success',
        data,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }
}
