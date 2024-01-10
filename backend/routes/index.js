import { Router } from 'express';
import userRouter from './users.js';
import cardRouter from './cards.js';
import auth from '../middlewares/auth.js';
import { checkSigninValidation, checkSignupValidation } from '../middlewares/joiAuthValidation.js';
import { createUser, login } from '../controllers/users.js';

const router = Router();
router.post('/signup', checkSignupValidation, createUser);
router.post('/signin', checkSigninValidation, login);
router.use('/cards', auth, cardRouter);
router.use('/users', auth, userRouter);

export default router;
