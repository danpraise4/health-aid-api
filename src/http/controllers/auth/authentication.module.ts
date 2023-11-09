import AdminService from '../../../services/admin.service';
import AuthService from '../../../services/auth.service';
import EmailService from '../../../services/email.service';
import EncryptionService from '../../../services/encryption.service';
import TokenService from '../../../services/token.service';
import UserService from '../../../services/user.service';
import AdminAuth from './admin.auth';
import PatientAuth from './auth.controller';
import PaymentService from '../../../services/payment.service';
import Paga from '../../../services/Paga.service';

export const authController = new PatientAuth(
  new AuthService(
    new EncryptionService(),
    new TokenService(),
    new EmailService(),
  ),
  new UserService(),
  new EncryptionService(),
  new EmailService(),
  new TokenService(),
  new PaymentService(new Paga(), new EmailService(), new UserService()),
);

export const adminAuthController = new AdminAuth(
  new AuthService(
    new EncryptionService(),
    new TokenService(),
    new EmailService(),
  ),
  new AdminService(),
  new EncryptionService(),
  new TokenService(),
);
