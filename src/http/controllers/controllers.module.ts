/**
 * Use this module file to create instances of all controllers and simplify imports in to your routers
 */

import AdminService from '../../services/admin.service';
import EmailService from '../../services/email.service';
import EncryptionService from '../../services/encryption.service';
import UserService from '../../services/user.service';
import AdminController from './admin.controller';
import UserController from './users.controller';

export const userController = new UserController(new UserService());

export const adminController = new AdminController(
  new AdminService(),
  new EncryptionService(),
  new EmailService(),
);
