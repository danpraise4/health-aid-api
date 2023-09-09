/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import AppException from '../../exceptions/AppException';
import TokenService from '../../services/token.service';
import PatientService from '../../services/patient.service';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AdminService from '../../services/admin.service';
import Admin from '../../database/models/admin.model';
import Doctor from '../../database/models/healthworker.model';

export type RequestType = {
  [prop: string]: any;
} & Request;

export const isPatientAuthenticated = async (
  req: RequestType,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const _noAuth = () =>
      next(
        new AppException(
          `Oops!, you are not authenticated, login`,
          httpStatus.UNAUTHORIZED,
        ),
      );

    const { authorization } = req.headers;
    const _authHeader = authorization;
    if (!_authHeader) return _noAuth();
    const [id, token] = _authHeader.split(' ');
    if (!id || !token) return _noAuth();
    if (id.trim().toLowerCase() !== 'bearer') return _noAuth();
    const decodedToken = await new TokenService().verifyToken(token);
    const { sub, type } = decodedToken as JwtPayload;
    if (type === 'refresh')
      return next(
        new AppException('Oops!, wrong token type', httpStatus.FORBIDDEN),
      );
    let Patient = await new PatientService().getPatientById(sub);
    if (!Patient) {
      Patient = await new PatientService().getOne(Doctor, { _id: sub });
      if (!Patient)
        return next(
          new AppException(
            'Oops!, Patient does not exist',
            httpStatus.NOT_FOUND,
          ),
        );
    }

    /** Store the result in a req object */
    req.Patient = Patient;
    next();
  } catch (err: any) {
    return next(
      new AppException(err.message, err.status || httpStatus.UNAUTHORIZED),
    );
  }
};

export const isAdminAuthenticated = async (
  req: RequestType,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const _noAuth = () =>
      next(
        new AppException(
          `Oops!, you are not authenticated, login`,
          httpStatus.UNAUTHORIZED,
        ),
      );

    const { authorization } = req.headers;
    const _authHeader = authorization;
    if (!_authHeader) return _noAuth();
    const [id, token] = _authHeader.split(' ');
    if (!id || !token) return _noAuth();
    if (id.trim().toLowerCase() !== 'bearer') return _noAuth();
    const decodedToken = await new TokenService().verifyToken(token);
    const { sub, type } = decodedToken as JwtPayload;
    if (type === 'refresh')
      return next(
        new AppException('Oops!, wrong token type', httpStatus.FORBIDDEN),
      );
    const admin = await new AdminService().getOne(Admin, { _id: sub });
    if (!admin)
      return next(
        new AppException('Oops!, Patient does not exist', httpStatus.NOT_FOUND),
      );

    /** Store the result in a req object */
    req.admin = admin;
    next();
  } catch (err: any) {
    return next(
      new AppException(err.message, err.status || httpStatus.UNAUTHORIZED),
    );
  }
};
