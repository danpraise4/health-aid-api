/**
 * Use this module file to create instances of all controllers and simplify imports in to your routers
 */

import AdminService from '../../services/admin.service';
import EmailService from '../../services/email.service';
import EncryptionService from '../../services/encryption.service';
import PatientService from '../../services/patient.service';
import AdminController from './admin.controller';
import PatientController from './patient.controller';

export const patientController = new PatientController(new PatientService());

export const adminController = new AdminController(
  new AdminService(),
  new EncryptionService(),
  new EmailService(),
);
