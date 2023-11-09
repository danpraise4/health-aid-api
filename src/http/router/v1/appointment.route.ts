import { Router } from 'express';
import { appointmentController } from '../../controllers/controllers.module';
import {
  acceptAppointment,
  appointmentValidator,
} from '../../../validators/appointment.validator';
import validate from '../../middlewares/validate';
import { isUserAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();
router
  .route('/')
  .get((req, res, next) => {
    appointmentController.index(req, res, next);
  })
  .post(
    isUserAuthenticated,
    validate(appointmentValidator),
    (req, res, next) => {
      appointmentController.create(req, res, next);
    },
  );

router
  .route('/accept/:appointmentId')
  .get(isUserAuthenticated, validate(acceptAppointment), (req, res, next) => {
    appointmentController.acceptAppointment(req, res, next);
  });

  
export default router;
