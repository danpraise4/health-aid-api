import { NextFunction, Response } from 'express';
import Admin from '../../database/models/admin.model';
import AdminService from '../../services/admin.service';
import { RequestType } from '../middlewares/auth.middleware';
import { ACCOUNT_STATUS, ADMIN_ROLE } from '../../../config/constants';
import EncryptionService from '../../services/encryption.service';
import HelperClass from '../../utils/helper';
import EmailService from '../../services/email.service';
import httpStatus from 'http-status';
import AppException from '../../exceptions/AppException';
import pick from '../../utils/pick';
import { deleteFile, uploadBase64File } from '../../services/file.service';
import moment from 'moment';
export default class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly encryptionService: EncryptionService,
    private readonly emailService: EmailService,
  ) {}

  async createAdmin(req: RequestType, res: Response, next: NextFunction) {
    try {
      const emailTaken = await this.adminService.getOne<Admin>(Admin, {
        email: req.body.email,
      });
      delete req.body.confirmPassword;
      const phoneNumberTaken = await this.adminService.getOne<Admin>(Admin, {
        phoneNumber: req.body.phoneNumber,
      });
      if (emailTaken) throw new Error(`Oops!, ${emailTaken.email} is taken`);
      if (phoneNumberTaken)
        throw new Error(`Oops!, ${phoneNumberTaken.phoneNumber} is taken`);
      if (
        req.body.portfolio === ADMIN_ROLE.SUPER_ADMIN &&
        req.admin.portfolio !== ADMIN_ROLE.ENGINEER
      )
        throw new Error('Oops!, you are not allowed to create a super admin');
      const password = req.body.password;
      req.body.password = await this.encryptionService.hashPassword(
        req.body.password,
      );
      req.body.firstName = HelperClass.titleCase(req.body.firstName);
      req.body.lastName = HelperClass.titleCase(req.body.lastName);
      req.body.referralCode = HelperClass.generateRandomChar(6, 'upper-num');
      req.body.phoneNumber = req.body.phoneNumber.startsWith('+234')
        ? req.body.phoneNumber
        : `+234${req.body.phoneNumber.replace(/^0+/, '')}`;
      req.body.accountStatus = {
        status: ACCOUNT_STATUS.CONFIRMED,
        reason: 'Account activated',
        updatedBy: req.admin.id,
        updatedAt: moment().toDate(),
      };
      const data = await this.adminService.create<Admin>(Admin, req.body);
      await this.emailService.sendAdminLoginCredentials(
        data.email,
        `${data.firstName} ${data.lastName}`,
        `Admin created successfully, login credentials has been sent to ${data.email} and ${data.phoneNumber}`,
        password,
      );
      res.status(httpStatus.CREATED).json({
        status: 'success',
        admin: data,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException) {
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
      }
    }
  }

  async getAdmins(req: RequestType, res: Response, next: NextFunction) {
    try {
      const filter = pick(req.query, ['accountStatus', 'role']);
      const options = pick(req.query, ['orderBy', 'page', 'limit', 'populate']);
      if (req.query.search) {
        const search = {
          $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        };
        Object.assign(filter, search);
      }
      const data = await this.adminService.getAll<Admin>(
        Admin,
        filter,
        options,
      );
      res.status(httpStatus.OK).json({
        status: 'success',
        data,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException) {
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
      }
    }
  }

  async getAdmin(req: RequestType, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getOne<Admin>(Admin, {
        _id: req.params.adminId,
      });
      if (!data) throw new Error('Admin not found');
      res.status(httpStatus.OK).json({
        status: 'success',
        data,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException) {
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
      }
    }
  }

  async updateAdmin(req: RequestType, res: Response, next: NextFunction) {
    try {
      req.body.updatedBy = req.admin.id;
      if (req.body.password) {
        if (
          !(await this.encryptionService.comparePassword(
            req.admin.password,
            req.body.oldPassword,
          ))
        )
          throw new Error(`Oops!, old password is incorrect`);

        req.body.password = await this.encryptionService.hashPassword(
          req.body.password,
        );
      }
      if (req.body.avatar) {
        if (req.admin.avatar.publicId) {
          await deleteFile(req.admin?.avatar?.publicId);
        }
        const publicId = HelperClass.generateRandomChar(12);
        const photo = await uploadBase64File(
          req.body.avatar,
          'admin_avatar',
          publicId,
        );

        req.body.avatar = { url: photo.secure_url, publicId };
      }
      req.body.updatedBy = req.admin.id;
      req.body.updatedAt = moment().utc().toDate();
      const data = await this.adminService.update<Admin>(
        Admin,
        { _id: req.params.adminId },
        req.body,
      );
      if (!data) throw new Error('Admin not found');
      res.status(httpStatus.OK).json({
        status: 'success',
        data,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException) {
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
      }
    }
  }
}
