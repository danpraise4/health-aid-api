// import { Router } from 'express';
// import { isAdminAuthenticated } from '../../middlewares/auth.middleware';
// import { restrictAdminAccessTo } from '../../middlewares/role.middleware';
// import { ADMIN_ROLE } from '../../../../config/constants';
// import validate from '../../middlewares/validate';
// import {
//   adminController,
// } from '../../controllers/controllers.module';
// import { createAdminValidator } from '../../../validators/auth-validator';
// import { createAgent } from '../../../validators/agent.validator';

// const router = Router();
// router
//   .route('/auth/create')
//   .post(validate(createAdminValidator), (req, res, next) => {
//     adminController.createAdmin(req, res, next);
//   })
//   .get(
//     isAdminAuthenticated,
//     restrictAdminAccessTo(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ENGINEER),
//     (req, res, next) => {
//       adminController.getAdmins(req, res, next);
//     },
//   );

// router
//   .route('/agent')
//   .get(
//     isAdminAuthenticated,
//     restrictAdminAccessTo(
//       ADMIN_ROLE.ENGINEER,
//       ADMIN_ROLE.SUB_ADMIN,
//       ADMIN_ROLE.SUPER_ADMIN,
//     ),
//     (req, res, next) => {
//       agentController.getAgents(req, res, next);
//     },
//   )
//   .post(
//     isAdminAuthenticated,
//     restrictAdminAccessTo(
//       ADMIN_ROLE.ENGINEER,
//       ADMIN_ROLE.SUB_ADMIN,
//       ADMIN_ROLE.SUPER_ADMIN,
//     ),
//     validate(createAgent),
//     (req, res, next) => {
//       agentController.createAgent(req, res, next);
//     },
//   );

// router
//   .route('/:agentId')
//   .patch((req, res, next) => {
//     agentController.updateAgent(req, res, next);
//   })
//   .delete((req, res, next) => {
//     agentController.deleteAgent(req, res, next);
//   });

// export default router;
