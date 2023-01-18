import express from 'express';
const router = express.Router();

import { register, login, updateUser } from '../controllers/authController.js';
import authorizationUser from '../middleware/auth.js';

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser').patch(authorizationUser, updateUser);

export default router;
