import { NextFunction, Response } from 'express';
import AppointmentService from '../../services/appointment.service';
import { RequestType } from '../middlewares/auth.middleware';
import AppException from '../../exceptions/AppException';
import httpStatus from 'http-status';
import Appointment from '../../database/models/appointment.model';
import PaymentService from '../../services/payment.service';
import apiGatewayConfig from '../../../config/apiGatewayConfig';
import {
  APPOINTMENT_CHANNEL,
  APPOINTMENT_STATUS,
  PAYSTACK_TRANSACTION_STATUS,
} from '../../../config/constants';
import HelperClass from '../../utils/helper';
import pick from '../../utils/pick';

export default class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(req: RequestType, res: Response, next: NextFunction) {
    try {
      req.body.user = req.user.id;
      const appointment = await this.appointmentService.create(
        Appointment,
        req.body,
      );
      if (!req.body.card) {
        const initalize = await this.paymentService.initlaizePayment({
          email: req.user.email,
          amount:
            req.body.type === APPOINTMENT_CHANNEL.VIDEO
              ? HelperClass.convertToKobo(
                  Number(
                    apiGatewayConfig.paymentProcessingCost.videoCallCharge,
                  ),
                )
              : HelperClass.convertToKobo(
                  Number(
                    apiGatewayConfig.paymentProcessingCost.audioCallCharge,
                  ),
                ),
          metadata: JSON.stringify({
            appointmentId: appointment._id.toString(),
            user: req.user._id.toString(),
          }),
        });

        await this.paymentService.savePaystackTransactionLog({
          reference: initalize.data.reference,
          user: req.user._id.toString(),
          amount: initalize.data.amount,
          currency: 'NGN',
          status: PAYSTACK_TRANSACTION_STATUS.PENDING,
        });

        return res.status(httpStatus.OK).json({
          status: 'success',
          isUsingPaymentLink: true,
          message: 'Payment initialized',
          data: initalize.data.authorization_url,
        });
      }

      await this.paymentService.chargeCard({
        email: req.user.email,
        amount:
          req.body.type === APPOINTMENT_CHANNEL.VIDEO
            ? Number(apiGatewayConfig.paymentProcessingCost.videoCallCharge)
            : Number(apiGatewayConfig.paymentProcessingCost.audioCallCharge),
        metadata: JSON.stringify({
          appointmentId: appointment._id.toString(),
        }),
        authorization_code: req.body.card,
      });
      res.status(httpStatus.CREATED).json({
        status: 'success',
        isUsingPaymentLink: false,
        message: 'Appointment booked successfully',
        data: appointment,
      });
    } catch (err: unknown) {
      if (err instanceof Error)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async index(req: RequestType, res: Response, next: NextFunction) {
    try {
      const filter = pick(req.query, [
        'user',
        'type',
        'paymentStatus',
        'channel',
      ]);
      const options = pick(req.query, ['orderBy', 'limit', 'page', 'populate']);
      const appointments = await this.appointmentService.getAll(
        Appointment,
        filter,
        options,
      );
      res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Appointments fetched successfully',
        data: appointments,
      });
    } catch (err: unknown) {
      if (err instanceof Error)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }

  async acceptAppointment(req: RequestType, res: Response, next: NextFunction) {
    try {
      const appointment = await this.appointmentService.update(
        Appointment,
        { _id: req.params.appointmentId },
        { healthWorker: req.user.id, status: APPOINTMENT_STATUS.ACCEPTED },
      );
      res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Appointment accepted successfully',
        data: appointment,
      });
    } catch (err: unknown) {
      if (err instanceof Error)
        return next(new AppException(err.message, httpStatus.BAD_REQUEST));
    }
  }
}
