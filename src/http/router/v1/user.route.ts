import { Router } from 'express';
import { userController } from '../../controllers/controllers.module';
import { isUserAuthenticated } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';
import { updateUserAccount } from '../../../validators/auth-validator';
import upload from '../../../utils/multer.config';

const route = Router();

route.route('/notification').get(isUserAuthenticated, (req, res, next) => {
  userController.getNotifications(req, res, next);
});

route
  .route('/me')
  .get(isUserAuthenticated, (req, res, next) => {
    userController.getMyProfile(req, res, next);
  })
  .patch(isUserAuthenticated, validate(updateUserAccount), (req, res, next) => {
    userController.updateMyProfile(req, res, next);
  });

route
  .route('/upload-avatar')
  .patch(isUserAuthenticated, upload.single('file'), (req, res, next) => {
    userController.uploadAvatar(req, res, next);
  });

route.get('/search', isUserAuthenticated, (req, res, next) => {
  userController.searchUsers(req, res, next);
});

route.route('/device').post(isUserAuthenticated, (req, res, next) => {
  userController.saveUserDeviceInfo(req, res, next);
});

route.get('/:user', isUserAuthenticated, (req, res, next) => {
  userController.getUserProfile(req, res, next);
});

export default route;
