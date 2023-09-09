import AdminService from '../../../services/admin.service';
import AuthService from '../../../services/auth.service';
import EmailService from '../../../services/email.service';
import EncryptionService from '../../../services/encryption.service';
import TokenService from '../../../services/token.service';
import PatientService from '../../../services/patient.service';
import AdminAuth from './admin.auth';
import PatientAuth from './auth.controller';

export const authController = new PatientAuth(
  new AuthService(
    new EncryptionService(),
    new TokenService(),
    new EmailService(),
  ),
  new PatientService(),
  new EncryptionService(),
  new EmailService(),
);

export const adminAuthController = new AdminAuth(
  new AuthService(
    new EncryptionService(),
    new TokenService(),
    new EmailService(),
  ),
  new AdminService(),
  new EncryptionService(),
);
