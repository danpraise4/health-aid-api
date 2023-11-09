import { Router } from 'express';
import authRoute from './auth.route';
import UserRoute from './user.route';
import paymentRoute from './payment.route';
import appointmentRoute from './appointment.route';

const router = Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/user', route: UserRoute },
  { path: '/payment', route: paymentRoute },
  { path: '/appointment', route: appointmentRoute },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
