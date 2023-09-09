import { Router } from 'express';
import authRoute from './auth.route';
import UserRoute from './user.route';

const router = Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/user', route: UserRoute },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
