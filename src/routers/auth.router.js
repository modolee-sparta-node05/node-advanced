import express from 'express';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post('/sign-up', signUpValidator, authController.signUp);

authRouter.post('/sign-in', signInValidator, authController.signIn);

export { authRouter };
