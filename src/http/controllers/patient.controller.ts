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
import HealthWorker from '../../database/models/health_worker.model';
import { PORTFOLIO } from '../../../config/constants';
import Patient from '../../database/models/patient.model';

export default class PatientController {
  constructor(private readonly patientService: PatientService) {}
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

      const patient = await this.patientService.getAllPatients(filter, options);
      return res.status(httpStatus.OK).json({
        status: 'success',
        patient,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async getMyProfile(req: RequestType, res: Response, next: NextFunction) {
    try {
      let me: Patient | HealthWorker;
      me = await this.patientService.getPatientById(req.user.id, true);
      if (!me) {
        me = await this.patientService.getOne(HealthWorker, {
          _id: req.user.id,
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
        if (req.user.avatar) {
          await deleteFile(req.user.avatar.publicId);
        }
        const { secure_url, public_id } = (await uploadBase64File(
          req.body.avatar,
          'patient_avatar',
          HelperClass.generateRandomChar(9),
        )) as UploadApiResponse;
        req.body.avatar = { url: secure_url, publicId: public_id };
      }
      let me;
      req.user.portfolio === PORTFOLIO.PATIENT
        ? (me = await this.patientService.updatePatientById(
            req.user.id,
            req.body,
          ))
        : (me = await this.patientService.update(
            HealthWorker,
            { _id: req.user.id },
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
      req.user.portfolio === PORTFOLIO.PATIENT
        ? (me = await this.patientService.updatePatientById(req.user.id, {
            avatar: { url: secure_url, publicId: public_id },
          }))
        : (me = await this.patientService.update(
            HealthWorker,
            { _id: req.user.id },
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
      let user: Patient | HealthWorker;
      user = await this.patientService.getOne(Patient, {
        _id: req.params.patient,
      });
      if (!user) {
        user = await this.patientService.getOne(HealthWorker, {
          _id: req.params.patient,
        });
        if (!user) throw new Error('User not found');
      }
      return res.status(httpStatus.OK).json({
        status: 'success',
        user,
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
      const user = await this.patientService.searchPatients(filter);
      return res.status(httpStatus.OK).json({
        status: 'success',
        user,
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
      const data = await this.patientService.savePatientDeviceInfo(
        req.body,
        req.user,
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
