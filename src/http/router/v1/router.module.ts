import { Router } from 'express';
import authRoute from './auth.route';
import PatientRoute from './patient.route';

const router = Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/patient', route: PatientRoute },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
