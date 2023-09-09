/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import AppException from '../../exceptions/AppException';
import { RequestType } from '../middlewares/auth.middleware';
import pick from '../../utils/pick';
import HelperClass from '../../utils/helper';
import { UploadApiResponse } from 'cloudinary';
import UserService from '../../services/user.service';
import NotificationService from '../../services/notification.service';
import { deleteFile, uploadBase64File } from '../../services/file.service';
import User from '../../database/models/patient.model';
import Doctor from '../../database/models/doctor.model';
import { PORTFOLIO } from '../../../config/constants';

export default class UserController {
  constructor(private readonly userService: UserService) {}
  async getAllUsers(req: RequestType, res: Response, next: NextFunction) {
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

      const users = await this.userService.getAllUsers(filter, options);
      return res.status(httpStatus.OK).json({
        status: 'success',
        users,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async getMyProfile(req: RequestType, res: Response, next: NextFunction) {
    try {
      let me = await this.userService.getUserById(req.user.id, true);
      if (!me) {
        me = await this.userService.getOne(Doctor, {
          _id: req.user.id,
        });
        if (!me) throw new Error('User not found');
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
          'user_avatar',
          HelperClass.generateRandomChar(9),
        )) as UploadApiResponse;
        req.body.avatar = { url: secure_url, publicId: public_id };
      }
      let me;
      req.user.portfolio === PORTFOLIO.USER
        ? (me = await this.userService.updateUserById(req.user.id, req.body))
        : (me = await this.userService.update(
            Doctor,
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
        'user_avatar',
        HelperClass.generateRandomChar(9),
      );
      let me;
      req.user.portfolio === PORTFOLIO.USER
        ? (me = await this.userService.updateUserById(req.user.id, {
            avatar: { url: secure_url, publicId: public_id },
          }))
        : (me = await this.userService.update(
            Doctor,
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

  async getUserProfile(req: RequestType, res: Response, next: NextFunction) {
    try {
      let user = await this.userService.getOne(User, {
        _id: req.params.user,
      });
      if (!user) {
        user = await this.userService.getOne(Doctor, {
          _id: req.params.user,
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

  async searchUsers(req: RequestType, res: Response, next: NextFunction) {
    try {
      const filter = {};
      Object.assign(filter, {
        $or: [
          { firstName: { $regex: req.query.q, $options: 'i' } },
          { lastName: { $regex: req.query.q, $options: 'i' } },
          { systemCode: { $regex: req.query.q, $options: 'i' } },
        ],
      });
      const user = await this.userService.searchUsers(filter);
      return res.status(httpStatus.OK).json({
        status: 'success',
        user,
      });
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AppException)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async saveUserDeviceInfo(
    req: RequestType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await this.userService.saveUserDeviceInfo(
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
      const filter = pick(req.query, ['user']);
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
