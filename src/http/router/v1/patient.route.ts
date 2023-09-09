import { Router } from 'express';
import { patientController } from '../../controllers/controllers.module';
import { isPatientAuthenticated } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';
import { updatePatientAccount } from '../../../validators/auth-validator';
import upload from '../../../utils/multer.config';

const route = Router();

route.route('/notification').get(isPatientAuthenticated, (req, res, next) => {
  patientController.getNotifications(req, res, next);
});

route
  .route('/me')
  .get(isPatientAuthenticated, (req, res, next) => {
    patientController.getMyProfile(req, res, next);
  })
  .patch(
    isPatientAuthenticated,
    validate(updatePatientAccount),
    (req, res, next) => {
      patientController.updateMyProfile(req, res, next);
    },
  );

route
  .route('/upload-avatar')
  .patch(isPatientAuthenticated, upload.single('file'), (req, res, next) => {
    patientController.uploadAvatar(req, res, next);
  });

route.get('/search', isPatientAuthenticated, (req, res, next) => {
  patientController.searchPatients(req, res, next);
});

route.route('/device').post(isPatientAuthenticated, (req, res, next) => {
  patientController.savePatientDeviceInfo(req, res, next);
});

route.get('/:patient', isPatientAuthenticated, (req, res, next) => {
  patientController.getPatientProfile(req, res, next);
});

export default route;
