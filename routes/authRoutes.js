import express from 'express';
const router = express.Router();

import rateLimiter from 'express-rate-limit';

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests max
  message:
    'Too many requests from this IP address, please try again after 15 minutes.',
});

import { register, login, updateUser } from '../controllers/authController.js';
import authorizationUser from '../middleware/auth.js';

router.route('/register').post(apiLimiter, register);
router.route('/login').post(apiLimiter, login);
router.route('/updateUser').patch(authorizationUser, updateUser);

export default router;
