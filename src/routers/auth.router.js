import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { AuthService } from '../services/auth.service.js';

const authRouter = express.Router();

const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

authRouter.post('/sign-up', signUpValidator, authController.signUp);

authRouter.post('/sign-in', signInValidator, authController.signIn);

export { authRouter };
